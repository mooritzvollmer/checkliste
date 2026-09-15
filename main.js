import './src/style.css'
import { sections } from './src/checks.js'

const STORAGE_KEY = 'a11y-checklist-v2'
const app = document.querySelector('#app')
const allChecks = sections.flatMap(section => section.checks.map(check => ({ ...check, section: section.title })))
let completed = new Set([...loadCompleted()].filter(id => allChecks.some(check => check.id === id)))
let activeFilter = 'alle'
const collapsedSections = new Set(sections.slice(1).map((_, index) => index + 1))

app.innerHTML = `
  <a class="skip-link" href="#main-content">Zum Hauptinhalt</a>
  <header class="topbar">
    <a class="brand" href="https://moritzvollmer.de/" target="_blank" rel="noopener noreferrer"><span>MV</span><b>Accessibility / Check</b></a>
    <div class="topbar-actions"><span class="version">WCAG 2.2 · A/AA</span><button id="reset" type="button">Zurücksetzen</button></div>
  </header>
  <aside class="sticky-progress" aria-label="Aktueller Bearbeitungsstand">
    <div><span>Bearbeitungsstand</span><b data-progress-percent>0%</b></div>
    <div class="sticky-progress-track" aria-hidden="true"><i data-progress-bar></i></div>
    <small aria-live="polite"><b data-progress-count>0</b> / ${allChecks.length}</small>
  </aside>
  <main id="main-content" tabindex="-1">
    <section class="hero">
      <div><p class="eyebrow">Practical review · 2026</p><h1>Barrierefreiheit<br><em>systematisch prüfen.</em></h1><p class="intro">Eine strukturierte Selbstprüfung für Websites – mit konkreten Tests, nachvollziehbaren WCAG-Bezügen und klaren Grenzen.</p></div>
      <aside class="progress-card" aria-labelledby="progress-title"><div class="progress-head"><span id="progress-title">Bearbeitungsstand</span><strong data-progress-percent>0%</strong></div><div class="progress-track" aria-hidden="true"><i data-progress-bar></i></div><p><b data-progress-count>0</b> von ${allChecks.length} Prüfpunkten dokumentiert</p><small>Kein Konformitätsnachweis · kein Audit-Score</small></aside>
    </section>
    <section class="scope" aria-labelledby="scope-title"><div><p class="eyebrow">Vor dem Start</p><h2 id="scope-title">Was diese Liste leistet.</h2></div><div class="scope-copy"><p>Die Checkliste hilft, häufige Barrieren früh zu erkennen und Maßnahmen nachvollziehbar abzuarbeiten. Sie orientiert sich an WCAG 2.2 auf Level A und AA.</p><p>Ein vollständig abgehakter Stand belegt keine Konformität. Dafür braucht es einen definierten Prüfumfang, repräsentative Seiten und Funktionen, geeignete Tools, manuelle Tests und möglichst Tests mit Menschen mit Behinderungen.</p></div></section>
    <nav class="contents" aria-labelledby="contents-title"><div><p class="eyebrow">Inhaltsverzeichnis</p><h2 id="contents-title">Prüfbereiche.</h2></div><ol>${sections.map((section, index) => `<li><a href="#section-${index}"><span>${String(index + 1).padStart(2, '0')}</span><b>${section.title}</b><small>${section.checks.length} Checks</small></a></li>`).join('')}</ol></nav>
    <section class="controls" aria-label="Checkliste filtern"><div class="filter-group"><button class="filter active" data-filter="alle">Alle <span>${allChecks.length}</span></button><button class="filter" data-filter="offen">Offen</button><button class="filter" data-filter="erledigt">Erledigt</button></div><label class="search"><span aria-hidden="true">⌕</span><input id="search" type="search" aria-label="Checkliste durchsuchen" placeholder="Prüfpunkt oder WCAG-Kriterium suchen"></label></section>
    <div id="checklist"></div>
    <section class="sources" aria-labelledby="sources-title"><p class="eyebrow">Methodik & Quellen</p><h2 id="sources-title">Prüfen heißt mehr als abhaken.</h2><div class="source-grid"><a href="https://www.w3.org/WAI/WCAG22/quickref/" target="_blank" rel="noopener noreferrer"><span>01</span><b>WCAG 2.2 Quick Reference</b><small>Erfolgskriterien, Erläuterungen und Techniken</small></a><a href="https://www.w3.org/WAI/test-evaluate/easy-checks/" target="_blank" rel="noopener noreferrer"><span>02</span><b>WAI Easy Checks</b><small>Schnelle, ausdrücklich nicht vollständige Erstprüfung</small></a><a href="https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/" target="_blank" rel="noopener noreferrer"><span>03</span><b>WCAG-EM</b><small>Methodik für belastbare Konformitätsbewertungen</small></a></div><p class="legal-note">Stand: August 2026. Diese Checkliste ist eine fachliche Orientierung, keine Rechtsberatung und keine Zertifizierung. Rechtliche Anforderungen hängen unter anderem von Angebot, Betreiber, Zielgruppe und anwendbaren Vorschriften ab.</p></section>
  </main>
  <footer><span>Ein Projekt von <a href="https://moritzvollmer.de/" rel="author">Moritz Vollmer</a> <small>// Accessibility Checklist</small></span><nav aria-label="Weiterführende Links"><a href="https://barrierefreiheit.moritzvollmer.de/">Barrierefreiheit</a><a href="https://farbtool.moritzvollmer.de/">Farbkontrast</a><a href="https://farbfehlsichtigkeit.moritzvollmer.de/">Farbsehen</a><a href="https://moritzvollmer.de/">Portfolio</a><a href="https://moritzvollmer.de/impressum/">Impressum</a><a href="https://moritzvollmer.de/datenschutz/">Datenschutz</a></nav></footer>`

function loadCompleted() { try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []) } catch { return new Set() } }
function saveCompleted() { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])) }
function render(query = '') {
  const normalizedQuery = query.trim().toLocaleLowerCase('de-DE')
  document.querySelector('#checklist').innerHTML = sections.map((section, sectionIndex) => {
    const checks = section.checks.filter(check => {
      const matchesState = activeFilter === 'alle' || (activeFilter === 'erledigt' ? completed.has(check.id) : !completed.has(check.id))
      const matchesQuery = [check.title, check.summary, check.test, check.wcag, section.title].join(' ').toLocaleLowerCase('de-DE').includes(normalizedQuery)
      return matchesState && matchesQuery
    })
    if (!checks.length) return ''
    const sectionDone = section.checks.filter(check => completed.has(check.id)).length
    const collapsed = !normalizedQuery && collapsedSections.has(sectionIndex)
    return `<section class="check-section" aria-labelledby="section-${sectionIndex}"><header class="section-header"><span>${String(sectionIndex + 1).padStart(2, '0')}</span><div class="section-title"><small>${section.kicker}</small><h2 id="section-${sectionIndex}">${section.title}</h2></div><small class="section-count">${sectionDone}/${section.checks.length}</small><button class="section-toggle" type="button" aria-expanded="${!collapsed}" aria-controls="section-checks-${sectionIndex}" aria-label="${section.title} ${collapsed ? 'öffnen' : 'schließen'}"><i aria-hidden="true">${collapsed ? '+' : '−'}</i></button></header><div class="check-grid" id="section-checks-${sectionIndex}" ${collapsed ? 'hidden' : ''}>${checks.map(check => checkTemplate(check)).join('')}</div></section>`
  }).join('') || '<div class="empty"><strong>Keine Treffer.</strong><p>Ändere Suche oder Filter.</p></div>'
  updateProgress()
}
function checkTemplate(check) {
  const checked = completed.has(check.id)
  return `<article class="check-card ${checked ? 'is-complete' : ''}"><div class="check-main"><input class="check-input" type="checkbox" id="${check.id}" ${checked ? 'checked' : ''}><label for="${check.id}"><span class="custom-check" aria-hidden="true"></span><span class="check-copy"><small>${check.level} · WCAG ${check.wcag}</small><strong>${check.title}</strong><span>${check.summary}</span></span></label><button class="detail-toggle" type="button" aria-expanded="false" aria-controls="detail-${check.id}"><span>So prüfst du es</span><i>+</i></button></div><div class="check-detail" id="detail-${check.id}" hidden><p>${check.test}</p>${check.tip ? `<aside><b>Sicherer Hinweis</b>${check.tip}</aside>` : ''}</div></article>`
}
function updateProgress() { const count = completed.size; const percent = Math.round(count / allChecks.length * 100); document.querySelectorAll('[data-progress-count]').forEach(item => { item.textContent = count }); document.querySelectorAll('[data-progress-percent]').forEach(item => { item.textContent = `${percent}%` }); document.querySelectorAll('[data-progress-bar]').forEach(item => { item.style.width = `${percent}%` }) }
document.querySelector('#checklist').addEventListener('change', event => { if (!event.target.matches('.check-input')) return; event.target.checked ? completed.add(event.target.id) : completed.delete(event.target.id); saveCompleted(); render(document.querySelector('#search').value) })
document.querySelector('#checklist').addEventListener('click', event => {
  const sectionButton = event.target.closest('.section-toggle')
  if (sectionButton) {
    const detail = document.getElementById(sectionButton.getAttribute('aria-controls'))
    const expanded = sectionButton.getAttribute('aria-expanded') === 'true'
    const sectionIndex = Number(detail.id.replace('section-checks-', ''))
    sectionButton.setAttribute('aria-expanded', String(!expanded))
    sectionButton.setAttribute('aria-label', `${sections[sectionIndex].title} ${expanded ? 'öffnen' : 'schließen'}`)
    sectionButton.querySelector('i').textContent = expanded ? '+' : '−'
    detail.hidden = expanded
    expanded ? collapsedSections.add(sectionIndex) : collapsedSections.delete(sectionIndex)
    return
  }
  const button = event.target.closest('.detail-toggle')
  if (!button) return
  const detail = document.getElementById(button.getAttribute('aria-controls'))
  const expanded = button.getAttribute('aria-expanded') === 'true'
  button.setAttribute('aria-expanded', String(!expanded))
  button.querySelector('i').textContent = expanded ? '+' : '−'
  detail.hidden = expanded
})
document.querySelector('.filter-group').addEventListener('click', event => { const button = event.target.closest('[data-filter]'); if (!button) return; activeFilter = button.dataset.filter; document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button)); render(document.querySelector('#search').value) })
document.querySelector('#search').addEventListener('input', event => render(event.target.value))
document.querySelector('#reset').addEventListener('click', () => { if (!confirm('Gesamten Bearbeitungsstand zurücksetzen?')) return; completed.clear(); saveCompleted(); render(document.querySelector('#search').value) })
render()
