const TELLER_PRODUCTS = [
  { id: 1, n: "Authentic", b: "Vans", c: "Sepatu", p: 360000, f: 0, w: 1, m: "Kanvas, sol karet vulkanisir", d: "Model paling dasar Vans: ringan, simpel, dan mudah dipadukan dengan outfit apa pun." },
  { id: 2, n: "Old Skool", b: "Vans", c: "Sepatu", p: 370000, f: 1, w: 0, m: "Kanvas & suede, sol karet vulkanisir", d: "Sepatu skate legendaris dengan side stripe khas dan bantalan kaki yang nyaman." },
  { id: 3, n: "Chuck 70 High", b: "Converse", c: "Sepatu", p: 390000, f: 1, w: 0, m: "Kanvas premium, midsole krem, insole OrthoLite", d: "Versi premium Chuck Taylor dengan kanvas tebal, sol lebih tinggi, dan bantalan lebih empuk." },
  { id: 4, n: "Chuck 70 Low", b: "Converse", c: "Sepatu", p: 380000, f: 0, w: 1, m: "Kanvas premium, midsole krem, insole OrthoLite", d: "Siluet low-top Chuck 70 yang santai dan serbaguna untuk dipakai harian." },
  { id: 5, n: "Long Sleeve", b: "Fred Perry", c: "Pakaian", p: 290000, f: 1, w: 0, m: "Katun piqu\u00e9, logo laurel wreath bordir", d: "Kaus lengan panjang bergaya klasik Inggris dengan potongan rapi dan bahan nyaman." },
  { id: 6, n: "Polo Shirt", b: "Fred Perry", c: "Pakaian", p: 320000, f: 1, w: 1, m: "Katun piqu\u00e9, kerah rib bergaris", d: "Polo ikonik dengan logo laurel wreath, cocok untuk tampilan kasual maupun semi-formal." },
];
const TELLER_WA = "6285607720232"; // nomor WhatsApp toko (format internasional tanpa +)
const TELLER_BRANDS = ["Vans", "Converse", "Fred Perry"];
const TELLER_BRAND_IMG = { Vans: 1, Converse: 3, "Fred Perry": 5 };
const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rp = (n) => "Rp " + n.toLocaleString("id-ID");
const param = (k) => new URLSearchParams(location.search).get(k);
// ===== Keranjang (localStorage) =====
const getCart = () => {
  try {
    return (JSON.parse(localStorage.getItem("idhar_cart")) || []).filter((i) => TELLER_PRODUCTS.some((p) => p.id === i.id));
  } catch (e) {
    return [];
  }
};
const saveCart = (c) => {
  try {
    localStorage.setItem("idhar_cart", JSON.stringify(c));
  } catch (e) {}
  updateCount();
};
function updateCount() {
  const el = $("#idhar_count");
  if (el) el.textContent = getCart().reduce((a, i) => a + i.qty, 0);
}
function addToCart(id, size, qty) {
  const c = getCart(),
    x = c.find((i) => i.id === id && i.size === size);
  x ? (x.qty += qty) : c.push({ id, size, qty });
  saveCart(c);
}
// ===== Notifikasi =====
function toast(msg) {
  let t = $("#idhar_toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "idhar_toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("idhar_show");
  clearTimeout(t.h);
  t.h = setTimeout(() => t.classList.remove("idhar_show"), 2600);
}
// ===== Header & Footer (konsisten di semua halaman) =====
function buildLayout() {
  const nav = [
    ["index.html", "Home"],
    ["shop.html", "Shop"],
    ["brands.html", "Brands"],
    ["new-arrivals.html", "New Arrivals"],
    ["about.html", "About Us"],
    ["contact.html", "Contact"],
  ];
  const cur = location.pathname.split("/").pop() || "index.html";
  $("#idhar_header").innerHTML = `<div class="idhar_container idhar_navbar"><a class="idhar_logo" href="index.html">TELLER<span>MORROW</span></a>
<ul class="idhar_menu" id="idhar_menu">${nav.map((n) => `<li><a href="${n[0]}" class="${n[0] === cur ? "idhar_active" : ""}">${n[1]}</a></li>`).join("")}</ul>
<a class="idhar_cart-link" href="cart.html">Cart<span class="idhar_cart-count" id="idhar_count">0</span></a>
<button class="idhar_toggle" id="idhar_toggle" aria-label="Menu">&#9776;</button></div>`;
  $("#idhar_toggle").onclick = () => $("#idhar_menu").classList.toggle("idhar_open");
  $("#idhar_footer").innerHTML = `<div class="idhar_container"><div class="idhar_footer-grid"><div><h4>TELLER MORROW</h4><p>Step Into Your Own Style.<br>Toko sepatu dan pakaian untuk anak muda dan mahasiswa.</p></div>
<div><h4>Menu</h4>${nav.map((n) => `<a href="${n[0]}">${n[1]}</a>`).join("")}</div>
<div><h4>Kontak</h4><p>tellermorrow@gmail.com<br>+62 856 0772 0232<br>Tasikmalaya, Jawa Barat</p></div>
<div><h4>Media Sosial</h4><a href="https://www.instagram.com/tellermorrow22?utm_source=ig_web_button_share_sheet&cnvx=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener">Instagram</a></div></div>
<p class="idhar_copy">&copy; 2026 TELLER MORROW. Seluruh hak cipta dilindungi.</p></div>`;
  updateCount();
}
// ===== Kartu produk =====
const card = (p) => `<article class="idhar_product-card"><a class="idhar_card-img" href="product.html?id=${p.id}"><img src="images/p${p.id}.jpg" alt="${p.n}">${p.w ? '<span class="idhar_badge">New Arrival</span>' : ""}</a>
<div class="idhar_card-body"><small>${p.b} &middot; ${p.c}</small><h3>${p.n}</h3><strong>${rp(p.p)}</strong><a class="idhar_btn idhar_btn-dark idhar_btn-sm" href="product.html?id=${p.id}">View Details</a></div></article>`;
const fill = (sel, list) => {
  const e = $(sel);
  if (e) e.innerHTML = list.length ? list.map(card).join("") : '<p class="idhar_empty">Produk tidak ditemukan. Coba ubah kata kunci atau filter.</p>';
};
// ===== Logika per halaman =====
const pages = {
  home() {
    fill("#idhar_featured", TELLER_PRODUCTS.filter((p) => p.f).slice(0, 4));
    fill("#idhar_newlist", TELLER_PRODUCTS.filter((p) => p.w).slice(0, 4));
    $("#idhar_brandgrid").innerHTML = TELLER_BRANDS.map((b) => `<a class="idhar_brand-card" href="shop.html?brand=${encodeURIComponent(b)}"><img src="images/p${TELLER_BRAND_IMG[b]}.jpg" alt="${b}"><h3>${b}</h3></a>`).join("");
  },
  shop() {
    const q = $("#idhar_search"),
      b = $("#idhar_brand"),
      c = $("#idhar_cat"),
      pr = $("#idhar_price"),
      s = $("#idhar_sort");
    b.innerHTML = '<option value="">Semua Merek</option>' + TELLER_BRANDS.map((x) => `<option>${x}</option>`).join("");
    c.innerHTML = '<option value="">Semua Kategori</option>' + [...new Set(TELLER_PRODUCTS.map((p) => p.c))].map((x) => `<option>${x}</option>`).join("");
    if (param("brand")) b.value = param("brand");
    if (param("q")) q.value = param("q");
    const run = () => {
      let l = TELLER_PRODUCTS.filter((p) => p.n.toLowerCase().includes(q.value.trim().toLowerCase()) && (!b.value || p.b === b.value) && (!c.value || p.c === c.value));
      if (pr.value) {
        const [a, z] = pr.value.split("-").map(Number);
        l = l.filter((p) => p.p >= a && p.p <= z);
      }
      if (s.value === "low") l.sort((x, y) => x.p - y.p);
      else if (s.value === "high") l.sort((x, y) => y.p - x.p);
      else if (s.value === "new") l.sort((x, y) => y.w - x.w || y.id - x.id);
      fill("#idhar_list", l);
      $("#idhar_result").textContent = l.length + " produk ditemukan";
    };
    [q, b, c, pr, s].forEach((e) => e.addEventListener("input", run));
    run();
  },
  product() {
    const p = TELLER_PRODUCTS.find((x) => x.id == param("id")) || TELLER_PRODUCTS[0];
    let size = null,
      qty = 1;
    document.title = p.n + " | TELLER MORROW";
    $("#idhar_detail").innerHTML =
      `<div class="idhar_product-card"><img src="images/p${p.id}.jpg" alt="${p.n}"></div><div class="idhar_detail-info"><small>${p.b} &middot; ${p.c}</small><h1>${p.n}</h1><div class="idhar_price">${rp(p.p)}</div><p>${p.d}</p>
<div><strong>Ukuran</strong><div class="idhar_sizes">${(p.c === "Pakaian" ? ["S", "M", "L", "XL"] : [38, 39, 40, 41, 42, 43, 44, 45]).map((s) => `<button class="idhar_size" data-s="${s}">${s}</button>`).join("")}</div></div>
<div><strong>Jumlah</strong><br><div class="idhar_qty"><button id="idhar_minus">&minus;</button><span id="idhar_q">1</span><button id="idhar_plus">+</button></div></div>
<button class="idhar_btn idhar_btn-dark" id="idhar_add">Add to Cart</button>
<table class="idhar_spec"><tr><td>Bahan</td><td>${p.m}</td></tr><tr><td>Merek</td><td>${p.b}</td></tr><tr><td>Kategori</td><td>${p.c}</td></tr><tr><td>Ukuran tersedia</td><td>${p.c === "Pakaian" ? "S &ndash; XL" : "38 &ndash; 45"}</td></tr><tr><td>Garansi</td><td>7 hari tukar ukuran</td></tr></table></div>`;
    $$(".idhar_size").forEach(
      (b) =>
        (b.onclick = () => {
          $$(".idhar_size").forEach((x) => x.classList.remove("idhar_selected"));
          b.classList.add("idhar_selected");
          size = b.dataset.s;
        }),
    );
    $("#idhar_minus").onclick = () => {
      qty = Math.max(1, qty - 1);
      $("#idhar_q").textContent = qty;
    };
    $("#idhar_plus").onclick = () => {
      qty = Math.min(10, qty + 1);
      $("#idhar_q").textContent = qty;
    };
    $("#idhar_add").onclick = () => {
      if (!size) return toast("Pilih ukuran sepatu dulu.");
      addToCart(p.id, size, qty);
      toast(p.n + " (size " + size + ") masuk keranjang");
    };
    fill(
      "#idhar_related",
      TELLER_PRODUCTS.filter((x) => x.b === p.b && x.id !== p.id)
        .concat(TELLER_PRODUCTS.filter((x) => x.b !== p.b))
        .slice(0, 4),
    );
  },
  brands() {
    const info = { Vans: "Budaya skate dan kebebasan berekspresi.", Converse: "Kanvas ikonik sejak 1908.", "Fred Perry": "Heritage Inggris dengan logo laurel wreath yang ikonik." };
    $("#idhar_brandlist").innerHTML = TELLER_BRANDS.map(
      (b) =>
        `<div class="idhar_product-card"><img src="images/p${TELLER_BRAND_IMG[b]}.jpg" alt="${b}"><div class="idhar_card-body"><h3>${b}</h3><p>${info[b]}</p><a class="idhar_btn idhar_btn-dark idhar_btn-sm" href="shop.html?brand=${encodeURIComponent(b)}">Lihat Produk</a></div></div>`,
    ).join("");
  },
  new() {
    fill(
      "#idhar_list",
      TELLER_PRODUCTS.filter((p) => p.w),
    );
  },
  cart() {
    const box = $("#idhar_cartbox");
    const draw = () => {
      const c = getCart();
      if (!c.length) {
        box.innerHTML = '<p class="idhar_empty">Keranjang kamu masih kosong.</p><div class="idhar_actions"><a class="idhar_btn idhar_btn-dark" href="shop.html">Continue Shopping</a></div>';
        return;
      }
      let sub = 0;
      const rows = c
        .map((i, k) => {
          const p = TELLER_PRODUCTS.find((x) => x.id === i.id);
          sub += p.p * i.qty;
          return `<div class="idhar_cart-row"><img src="images/p${p.id}.jpg" alt="${p.n}"><div><h3>${p.n}</h3><small>${p.b} &middot; Size ${i.size}</small><div>${rp(p.p)}</div></div>
<div class="idhar_qty"><button data-a="m" data-k="${k}">&minus;</button><span>${i.qty}</span><button data-a="p" data-k="${k}">+</button></div><strong>${rp(p.p * i.qty)}</strong><button class="idhar_remove" data-a="d" data-k="${k}">Hapus</button></div>`;
        })
        .join("");
      const ship = sub >= 2000000 ? 0 : 25000;
      box.innerHTML =
        rows +
        `<div class="idhar_summary"><div><span>Subtotal</span><span>${rp(sub)}</span></div><div><span>Ongkir</span><span>${ship ? rp(ship) : "Gratis"}</span></div><div class="idhar_total"><span>Total</span><span>${rp(sub + ship)}</span></div><small>Pesanan dikirim lewat WhatsApp untuk konfirmasi dan pembayaran.</small></div>
<div class="idhar_actions"><a class="idhar_btn" href="shop.html">Continue Shopping</a><button class="idhar_btn idhar_btn-dark" id="idhar_checkout">Checkout</button></div>`;
      $$("[data-a]", box).forEach(
        (b) =>
          (b.onclick = () => {
            const c = getCart(),
              k = +b.dataset.k;
            if (b.dataset.a === "p") c[k].qty = Math.min(10, c[k].qty + 1);
            if (b.dataset.a === "m") c[k].qty = Math.max(1, c[k].qty - 1);
            if (b.dataset.a === "d") c.splice(k, 1);
            saveCart(c);
            draw();
          }),
      );
      // Checkout: susun pesan pesanan lalu buka WhatsApp toko
      $("#idhar_checkout").onclick = () => {
        const L = getCart().map((i, k) => {
          const p = TELLER_PRODUCTS.find((x) => x.id === i.id);
          return `${k + 1}. ${p.b} ${p.n} - Ukuran ${i.size} - ${i.qty} x ${rp(p.p)} = ${rp(p.p * i.qty)}`;
        });
        const msg = `Halo TELLER MORROW, saya mau pesan:\n${L.join("\n")}\n\nSubtotal: ${rp(sub)}\nOngkir: ${ship ? rp(ship) : "Gratis"}\nTotal: ${rp(sub + ship)}\n\nNama:\nAlamat pengiriman:`;
        window.open("https://wa.me/" + TELLER_WA + "?text=" + encodeURIComponent(msg), "_blank");
        toast("Membuka WhatsApp untuk konfirmasi pesanan...");
      };
    };
    draw();
  },
  contact() {
    const f = $("#idhar_form");
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      const err = (id, m) => {
        $("#idhar_e_" + id).textContent = m;
        if (m) ok = false;
      };
      const v = (id) => f.elements[id].value.trim();
      err("name", v("name").length < 3 ? "Nama minimal 3 karakter." : "");
      err("email", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v("email")) ? "" : "Format email tidak valid.");
      err("subject", v("subject").length < 4 ? "Subjek minimal 4 karakter." : "");
      err("message", v("message").length < 10 ? "Pesan minimal 10 karakter." : "");
      if (ok) {
        const msg = `Halo TELLER MORROW,\nNama: ${v("name")}\nEmail: ${v("email")}\nSubjek: ${v("subject")}\n\n${v("message")}`;
        window.open("https://wa.me/" + TELLER_WA + "?text=" + encodeURIComponent(msg), "_blank");
        toast("Pesan valid, membuka WhatsApp untuk mengirim...");
        f.reset();
      }
    });
  },
};
document.addEventListener("DOMContentLoaded", () => {
  buildLayout();
  const pg = document.body.dataset.page;
  if (pages[pg]) pages[pg]();
});
