const form = document.querySelector('#property-search');
const price = form.elements.valor;
const dialog = document.querySelector('#contact-dialog');
const title = document.querySelector('#dialog-title');
const description = document.querySelector('#dialog-description');
const summary = document.querySelector('#search-summary');
const nav = document.querySelector('#navigation');
const menu = document.querySelector('.menu-toggle');
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

function updatePrices() {
  const renting = form.elements.finalidade.value === 'alugar';
  const values = renting ? [1500, 2000, 2500, 3000, 4000, 5000] : [250000, 300000, 400000, 500000, 700000, 1000000];
  price.replaceChildren(new Option('Selecione', ''), ...values.map(value => new Option(currency.format(value), String(value))));
}
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menu'); }
function openDialog(kind) {
  summary.hidden = true;
  if (kind === 'about') {
    title.textContent = 'Conheça a Bruna Lauer';
    description.textContent = 'Corretora de imóveis em Sorocaba. Para morar ou investir, conte com a Bruna para conversar sobre o que você procura.';
  } else {
    title.textContent = 'Seu imóvel, novos planos.';
    description.textContent = 'Quer vender ou alugar seu imóvel em Sorocaba? Converse com a Bruna e conheça o trabalho dela.';
  }
  closeMenu();
  dialog.showModal();
}
form.addEventListener('change', event => { if (event.target.name === 'finalidade') updatePrices(); });
document.querySelectorAll('[data-purpose]').forEach(link => link.addEventListener('click', () => {
  form.elements.finalidade.value = link.dataset.purpose;
  updatePrices(); closeMenu();
}));
document.querySelectorAll('[data-dialog]').forEach(button => button.addEventListener('click', () => openDialog(button.dataset.dialog)));
document.querySelector('#search-intent').addEventListener('click', () => form.elements.bairro.focus());
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  title.textContent = data.get('finalidade') === 'alugar' ? 'Vamos encontrar seu próximo aluguel?' : 'Vamos encontrar seu próximo lar?';
  description.textContent = 'Converse com a Bruna para conferir imóveis disponíveis com o perfil que você procura.';
  const lines = ['Sorocaba, SP'];
  if (data.get('bairro').trim()) lines.push('Bairro: ' + data.get('bairro').trim());
  if (data.get('valor')) lines.push('Valor até: ' + currency.format(Number(data.get('valor'))));
  if (data.get('quartos')) lines.push('Quartos: ' + data.get('quartos') + ' ou mais');
  summary.textContent = lines.join('\n');
  summary.hidden = false;
  dialog.showModal();
});
updatePrices();
