var cartitem = "cart";
var localstorage = {
  savecart: function (object) {
    var stringcart = JSON.stringify(object);
    localStorage.setItem(cartitem, stringcart);
    return true;
  },
  getcart: function () {
    return JSON.parse(localStorage.getItem(cartitem));
  },
  deletecart: function () {
    localStorage.removeItem(cartitem);
  },
};

var adapter = {
  savecart: function (object) {
    var stringcart = JSON.stringify(object);
  },
  getcart: function () {
    return JSON.parse(data);
  },
  deletecart: function () {},
};
var storage = localstorage;
var productcart = {
  getfunc: function (id) {
    return document.getElementById(id).innerHTML;
  },
  setfunc: function (id, html) {
    document.getElementById(id).innerHTML = html;
    return true;
  },
  itemData: function (object) {
    var count = object.querySelector(".count"),
      numb = new RegExp("^[1-9]([0-9]+)?$");
    count.value = numb.test(count.value) === true ? parseInt(count.value) : 1;
    var item = {
      name: object.getAttribute("name"),
      price: object.getAttribute("price"),
      id: object.getAttribute("id"),
      count: count.value,
      total: parseInt(object.getAttribute("price")) * parseInt(count.value),
    };
    return item;
  },
  updateitems: function () {
    var items = cart.getItems(),
      template = this.getfunc("cart"),
      updated = _.template(template, {
        items: items,
      });
    this.setfunc("cartitems", updated);
    this.updateTotal();
  },
  emptyitems: function () {
    this.setfunc(
      "cartitems",
      "<p>გთხოვთ დაამატოთ კალათაში სასურველი პროდუქტი</p>"
    );
    this.updateTotal();
  },
  updateTotal: function () {
    this.setfunc("totalPrice", cart.total + "ლარი");
  },
};
var cart = {
  count: 0,
  total: 0,
  items: [],
  getItems: function () {
    return this.items;
  },
  setItems: function (items) {
    this.items = items;
    for (var i = 0; i < this.items.length; i++) {
      var _item = this.items[i];
      this.total += _item.total;
    }
  },
  deleteitems: function () {
    this.items = [];
    this.total = 0;
    storage.deletecart();
    productcart.emptyitems();
  },
  addItem: function (item) {
    if (this.containsItem(item.id) === false) {
      this.items.push({
        id: item.id,
        name: item.name,
        price: item.price,
        count: item.count,
        total: item.price * item.count,
      });
      storage.savecart(this.items);
    } else {
      this.updateitem(item);
    }
    this.total += item.price * item.count;
    this.count += item.count;
    productcart.updateitems();
  },
  containsItem: function (id) {
    if (this.items === undefined) {
      return false;
    }
    for (var i = 0; i < this.items.length; i++) {
      var _item = this.items[i];
      if (id == _item.id) {
        return true;
      }
    }
    return false;
  },
  updateitem: function (object) {
    for (var i = 0; i < this.items.length; i++) {
      var _item = this.items[i];

      if (object.id === _item.id) {
        _item.count = parseInt(object.count) + parseInt(_item.count);
        _item.total = parseInt(object.total) + parseInt(_item.total);
        this.items[i] = _item;
        storage.savecart(this.items);
      }
    }
  },
};

document.addEventListener("DOMContentLoaded", function () {
  if (storage.getcart()) {
    cart.setItems(storage.getcart());
    productcart.updateitems();
  } else {
    productcart.emptyitems();
  }
  var products = document.querySelectorAll(".product button");
  [].forEach.call(products, function (product) {
    product.addEventListener("click", function (e) {
      var item = productcart.itemData(this.parentNode);
      cart.addItem(item);
    });
  });

  document.querySelector("#clear").addEventListener("click", function (e) {
    cart.deleteitems();
  });
});
