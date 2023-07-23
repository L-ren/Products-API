require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.PGUSER,
  database: process.env.PGDB
});


module.exports.getProducts = async function(page = 1, count = 5) {
  // get ids for products on given page (count = products per page)
  let lastIndex = page * count;
  let firstIndex = lastIndex - count + 1;
  let ids = [];
  for (let i = firstIndex; i <= lastIndex; i += 1) {
    ids.push(i);
  };s

  const response = await pool.query({
    text: 'SELECT id, name, slogan, description, category, default_price FROM product WHERE id = ANY($1)',
    values: [ids]
  });
  return response.rows;
};

module.exports.getInfo = async function(product_id) {
  let productData = await pool.query({
    text: 'SELECT id, name, slogan, description, category, default_price FROM product WHERE id = ANY($1)',
    values: [[product_id]]
  });
  let response = productData.rows[0];
  if (response) {
    let featureData = await pool.query({
      text: 'SELECT feature, value FROM features WHERE product_id = ANY($1)',
      values: [[product_id]]
    });
    response.features = featureData.rows;
  };
  return response;
};

module.exports.getStyles = async function(product_id) {
  // get styles, photos, skus
  let styleData = await pool.query({
    text: 'SELECT id, name, sale_price, original_price, default_style FROM styles WHERE product_id = ANY($1)',
    values: [[product_id]]
  });

  // iterate over each style id, find photos and skus
  for (style of styleData.rows) {
    let photoData = await pool.query({
      text: 'SELECT url, thumbnail_url FROM photos WHERE style_id = ANY($1)',
      values: [[style.id]]
    });
    style.photos = photoData.rows;

    let skuData = await pool.query({
      text: 'SELECT id, size, quantity FROM skus WHERE style_id = ANY($1)',
      values: [[style.id]]
    });

    let skuProperty = {};
    for (sku of skuData.rows) {
      skuProperty[sku.id] = {
          quantity: sku.quantity,
          size: sku.size
        };
    };

    style.skus = skuProperty;
  };

  let response = {
    product_id,
    results: styleData.rows
  };
  return response;
};

module.exports.getRelated = async function(product_id) {
  let relatedData = await pool.query({
    text: 'SELECT related_product_id FROM related WHERE current_product_id = ANY($1)',
    values: [[product_id]]
  });

  let response = [];
  for (product of relatedData.rows) {
    response.push(product.related_product_id);
  }

  return response;
};