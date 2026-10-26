const products = [
  {id:'latte', name:'Latte', category:'Café', price:4200, icon:'☕', stock:24},
  {id:'capu', name:'Cappuccino', category:'Café', price:4200, icon:'☕', stock:18},
  {id:'flat', name:'Flat white', category:'Café', price:3600, icon:'☕', stock:11},
  {id:'americano', name:'Americano', category:'Café', price:3000, icon:'☕', stock:15},
  {id:'medialuna', name:'Medialuna', category:'Pastelería', price:1000, icon:'🥐', stock:8},
  {id:'brownie', name:'Brownie', category:'Pastelería', price:2400, icon:'🍫', stock:3},
  {id:'cookie', name:'Cookie de avena', category:'Pastelería', price:1800, icon:'🍪', stock:16},
  {id:'coldbrew', name:'Cold brew', category:'Fríos', price:4000, icon:'🧊', stock:12},
];
const orders = [
  {number:1048, items:'Latte + medialuna', time:'10:36', total:5200, status:'cobrada'},
  {number:1047, items:'2× Cappuccino', time:'10:31', total:8400, status:'pendiente'},
  {number:1046, items:'Flat white', time:'10:25', total:3600, status:'cobrada'},
  {number:1045, items:'Americano + tostado', time:'10:18', total:6800, status:'cobrada'},
];
const cart = new Map();
let category = 'Todas';
let toastTimer;
const money = amount => '$' + Math.round(amount).toLocaleString('es-AR');
const one = selector => document.querySelector(selector);
const toast = message => {
  const node = one('#latte-toast');
  node.textContent = message;
  node.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('show'), 2200);
};
function drawOrders(selector, rows, allowPay = false) {
  const target = one(selector);
  target.innerHTML = rows.length ? rows.map(order => `<div class="latte-order-row"><span class="latte-order-no">#${order.number}</span><span class="latte-order-detail"><b>${order.items}</b><small>Mostrador · ${order.time}</small></span><strong class="latte-order-price">${money(order.total)}</strong><span class="latte-status ${order.status === 'pendiente' ? 'pending' : ''}">${order.status === 'pendiente' ? 'En curso' : 'Cobrada'}</span>${allowPay && order.status === 'pendiente' ? `<button class="latte-text-button" data-pay="${order.number}">Cobrar</button>` : ''}</div>`).join('') : '<p class="latte-empty">No hay comandas en curso.</p>';
}
function drawProducts() {
  const query = one('#latte-search').value.trim().toLocaleLowerCase('es');
  const visible = products.filter(item => (category === 'Todas' || item.category === category) && item.name.toLocaleLowerCase('es').includes(query));
  one('#latte-products').innerHTML = visible.map(item => `<article class="latte-product"><span class="latte-product-icon">${item.icon}</span><span class="latte-product-info"><b>${item.name}</b><small>${item.category}</small><strong class="latte-product-price">${money(item.price)}</strong></span><button class="latte-add" data-add="${item.id}" aria-label="Agregar ${item.name}">+</button></article>`).join('') || '<p class="latte-empty">No encontramos ese producto.</p>';
}
function drawCart() {
  const rows = [...cart.entries()];
  one('#latte-cart').innerHTML = rows.length ? rows.map(([id, quantity]) => {
    const item = products.find(product => product.id === id);
    return `<div class="latte-cart-line"><b class="latte-cart-name">${item.name}</b><span class="latte-qty"><button data-step="-1" data-id="${id}" aria-label="Quitar uno">−</button><span>${quantity}</span><button data-step="1" data-id="${id}" aria-label="Agregar uno">+</button></span><span class="latte-line-total">${money(item.price * quantity)}</span></div>`;
  }).join('') : '<p class="latte-empty">Elegí productos para empezar.</p>';
  one('#latte-total').textContent = money(rows.reduce((total, [id, quantity]) => total + products.find(item => item.id === id).price * quantity, 0));
}
function drawStock() {
  const onlyLow = one('#latte-low-only').checked;
  const rows = products.filter(item => !onlyLow || item.stock <= 8);
  one('#latte-stock').innerHTML = `<div class="latte-stock-row"><span>Producto</span><span>Categoría</span><span>Disponible</span><span>Estado</span></div>` + rows.map(item => `<div class="latte-stock-row"><b>${item.name}</b><span>${item.category}</span><span>${item.stock} uds.</span><strong class="${item.stock <= 8 ? 'latte-stock-low' : 'latte-stock-ok'}">${item.stock <= 8 ? 'Reponer' : 'En stock'}</strong></div>`).join('');
}
function updateOrders() {
  drawOrders('#latte-recent', orders.slice(0, 5));
  drawOrders('#latte-open-orders', orders.filter(order => order.status === 'pendiente'), true);
  const count = orders.filter(order => order.status === 'pendiente').length;
  one('#latte-open-count').textContent = count;
  one('#latte-open-total').textContent = count;
}
function showScreen(view) {
  document.querySelectorAll('[data-latte-screen]').forEach(screen => { screen.hidden = screen.dataset.latteScreen !== view; });
  document.querySelectorAll('[data-latte-view]').forEach(button => button.classList.toggle('is-active', button.dataset.latteView === view));
  one('.latte-main').scrollTop = 0;
  if (view === 'stock') drawStock();
}
function showOrderTab(tab) {
  document.querySelectorAll('[data-order-tab]').forEach(button => button.classList.toggle('is-active', button.dataset.orderTab === tab));
  document.querySelectorAll('[data-order-panel]').forEach(panel => { panel.hidden = panel.dataset.orderPanel !== tab; });
  if (tab === 'curso') updateOrders();
}
document.querySelectorAll('[data-latte-view]').forEach(button => button.addEventListener('click', () => showScreen(button.dataset.latteView)));
document.querySelectorAll('[data-order-tab]').forEach(button => button.addEventListener('click', () => showOrderTab(button.dataset.orderTab)));
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
  category = button.dataset.category;
  document.querySelectorAll('[data-category]').forEach(tab => tab.classList.toggle('selected', tab === button));
  drawProducts();
}));
one('#latte-search').addEventListener('input', drawProducts);
one('#latte-products').addEventListener('click', event => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const id = button.dataset.add;
  cart.set(id, (cart.get(id) || 0) + 1);
  drawCart();
});
one('#latte-cart').addEventListener('click', event => {
  const button = event.target.closest('[data-step]');
  if (!button) return;
  const id = button.dataset.id;
  const quantity = (cart.get(id) || 0) + Number(button.dataset.step);
  quantity > 0 ? cart.set(id, quantity) : cart.delete(id);
  drawCart();
});
one('#latte-clear').addEventListener('click', () => { cart.clear(); drawCart(); });
one('#latte-save').addEventListener('click', () => {
  if (!cart.size) return toast('Agregá algún producto a la comanda.');
  const items = [...cart].map(([id, quantity]) => `${quantity}× ${products.find(item => item.id === id).name}`).join(', ');
  const total = [...cart].reduce((sum, [id, quantity]) => sum + products.find(item => item.id === id).price * quantity, 0);
  orders.unshift({number:Math.max(...orders.map(order => order.number)) + 1, items, time:'Ahora', total, status:'pendiente'});
  cart.clear(); drawCart(); updateOrders(); showOrderTab('curso'); toast('Comanda guardada en curso.');
});
one('#latte-open-orders').addEventListener('click', event => {
  const button = event.target.closest('[data-pay]');
  if (!button) return;
  const order = orders.find(item => item.number === Number(button.dataset.pay));
  if (order) order.status = 'cobrada';
  updateOrders(); toast('Comanda cobrada.');
});
one('#latte-low-only').addEventListener('change', drawStock);
updateOrders(); drawProducts(); drawCart(); drawStock();
