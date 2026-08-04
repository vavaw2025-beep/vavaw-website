const fs = require('fs');
const file = 'apps/main/app/cosmetic/cosmetic-content.tsx';
let content = fs.readFileSync(file, 'utf8');

const sections = [
  { id: '2', var: 'brandPhilosophy' },
  { id: '3', var: 'signatureCollection' },
  { id: '4', var: 'heroProduct' },
  { id: '5', var: 'productCards' },
  { id: '6', var: 'dailyRitual' },
  { id: '7', var: 'ingredientsBlock' },
  { id: '8', var: 'premiumProgram' },
  { id: '9', var: 'editorialGallery' },
  { id: '10', var: 'finalCta' },
];

for (const sec of sections) {
  // Regex to match the section header and the following <section> tag
  const searchStr = `SECTION ${sec.id} `;
  const idx = content.indexOf(searchStr);
  if (idx !== -1) {
    const sectionTagIdx = content.indexOf('<section ', idx);
    if (sectionTagIdx !== -1) {
      // Insert '{var && (' before <section>
      content = content.slice(0, sectionTagIdx) + `{${sec.var} && (\n      ` + content.slice(sectionTagIdx);
      
      // Now find the closing </section> for this section
      // We must find the next section header, or the end of the main div
      let nextIdx;
      if (sec.id === '10') {
        nextIdx = content.indexOf('</div>', sectionTagIdx); // end of container
      } else {
        nextIdx = content.indexOf(`SECTION ${parseInt(sec.id) + 1} `, sectionTagIdx);
      }
      
      const chunk = content.slice(sectionTagIdx, nextIdx);
      const lastClosingTagIdx = chunk.lastIndexOf('</section>');
      if (lastClosingTagIdx !== -1) {
        const absoluteClosingTagIdx = sectionTagIdx + lastClosingTagIdx;
        content = content.slice(0, absoluteClosingTagIdx + 10) + '\n      )}' + content.slice(absoluteClosingTagIdx + 10);
      }
    }
  }
}

fs.writeFileSync(file, content);
console.log('Done');
