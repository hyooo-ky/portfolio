import { readFile, writeFile, mkdir, cp, rm, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const escape = value => value.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

try {
  const works = JSON.parse(await readFile(path.join(root, 'data/works.json'), 'utf8'));
  if (!Array.isArray(works)) throw new Error('works.json must contain an array.');
  for (const [i, work] of works.entries()) {
    for (const key of ['title', 'category', 'url', 'img']) {
      if (typeof work?.[key] !== 'string' || !work[key].trim()) {
        throw new Error(`Work ${i + 1}: ${key} must be a non-empty string.`);
      }
    }
    if (!['https:', 'http:'].includes(new URL(work.url).protocol)) {
      throw new Error(`Work ${i + 1}: URL must start with https:// or http://.`);
    }
    if (!/^img\/(?!.*(?:^|\/)\.\.(?:\/|$))[^\\?#]+$/.test(work.img)) {
      throw new Error(`Work ${i + 1}: image must be a local file under img/.`);
    }
    if (work.roles !== undefined && (!Array.isArray(work.roles) || work.roles.some(role => typeof role !== 'string' || !role.trim()))) {
      throw new Error(`Work ${i + 1}: roles must contain non-empty strings.`);
    }
    if (work.archiveImage !== undefined) {
      if (typeof work.archiveImage !== 'string' || !/^img\/(?!.*(?:^|\/)\.\.(?:\/|$))[^\\?#]+$/.test(work.archiveImage)) {
        throw new Error(`Work ${i + 1}: archiveImage must be a local file under img/.`);
      }
      await access(path.join(root, work.archiveImage));
    }
    await access(path.join(root, work.img));
  }

  const cards = works.map(work => {
    const { title, category, url, img } = Object.fromEntries(
      Object.entries(work).map(([key, value]) => [key, typeof value === 'string' ? escape(value) : value])
    );
    const tags = (work.roles ?? []).length
      ? `<ul class="work-tags" aria-label="担当範囲">${work.roles.map(role => `<li class="work-tag">${escape(role)}</li>`).join('')}</ul>`
      : '';
    const link = work.archiveImage
      ? `href="${escape(work.archiveImage)}" data-preview-image="${escape(work.archiveImage)}" data-preview-title="${title}" aria-haspopup="dialog"`
      : `href="${url}"`;
    return `                    <article class="work-item">
                        <a ${link} target="_blank" rel="noopener noreferrer" class="work-link">
                            <div class="work-image-container">
                                <div class="work-image-placeholder">
                                    <img src="${img}" alt="${title}" loading="lazy">
                                </div>
                                <div class="work-overlay"><span class="view-more">View</span></div>
                            </div>
                            <div class="work-info">
                                <p class="work-category">${category}</p>
                                <h3 class="work-title">${title}</h3>
                                ${tags}
                            </div>
                        </a>
                    </article>`;
  }).join('\n');

  const indexPath = path.join(root, 'index.html');
  const source = await readFile(indexPath, 'utf8');
  const start = '<!-- works:start -->';
  const end = '<!-- works:end -->';
  if (source.split(start).length !== 2 || source.split(end).length !== 2 || source.indexOf(start) > source.indexOf(end)) {
    throw new Error('index.html must have exactly one ordered pair of works markers.');
  }
  const result = source.slice(0, source.indexOf(start) + start.length) + '\n' + cards + '\n' + source.slice(source.indexOf(end));
  await writeFile(indexPath, result);

  if (!process.argv.includes('--works-only')) {
    const dist = path.join(root, 'dist');
    await rm(dist, { recursive: true, force: true });
    await mkdir(dist, { recursive: true });
    for (const name of ['index.html', 'css', 'js', 'img']) {
      await cp(path.join(root, name), path.join(dist, name), { recursive: true });
    }
  }
  console.log(`Generated HTML for ${works.length} works.`);
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exitCode = 1;
}
