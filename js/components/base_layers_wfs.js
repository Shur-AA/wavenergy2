import GeoJSON from 'ol/format/GeoJSON';
import { Group, Vector as VectorLayer } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';



var styles = require('../appearence/styles');
var host = "http://localhost:8080";

function vector_source(host, name) {
  return new VectorSource({
    format: new GeoJSON(),
    url: `${host}/${name}.geojson`
  });
}


var base110_lyr_group_top = new Group({
  combine: true,
  visible: true,
  maxZoom: 3,
  name: '110m',
  layers: [
    new VectorLayer({
      style: function (feature) {
        name = feature.get('name');
        var style = styles.city_style(name);
        return style;
      },
      source: vector_source(host, 'ne_110m_cities'),
      declutter: true
    }),
    new VectorLayer({
      style: styles.coastline_style(),
      source: vector_source(host, 'ne_50m_land')
    })
  ]
});

var base110_lyr_group_bottom = new Group({
  combine: true,
  visible: true,
  maxZoom: 3,
  name: '110m',
  layers: [
    new VectorLayer({
      style: styles.country_style(),
      source: vector_source(host, 'ne_50m_land')
    })
  ]
});

var base50_lyr_group_top = new Group({
  combine: true,
  visible: true,
  minZoom: 3,
  maxZoom: 5,
  name: '50m',
  layers: [
    new VectorLayer({
      style: styles.river_style(),
      source: vector_source(host, 'ne_50m_rivers')
    }),
    new VectorLayer({
      style: styles.lake_style(),
      source: vector_source(host, 'ne_50m_lakes')
    }),
    new VectorLayer({
      style: function (feature) {
        name = feature.get('name');
        var style = styles.city_style(name);
        return style;
      },
      source: vector_source(host, 'ne_110m_cities'),
      declutter: true
    }),
    new VectorLayer({
      style: styles.coastline_style(),
      source: vector_source(host, 'ne_10m_land')
    })
  ]
});

var base50_lyr_group_bottom = new Group({
  combine: true,
  visible: true,
  minZoom: 3,
  maxZoom: 5,
  name: '50m',
  layers: [
    new VectorLayer({
      style: styles.country_style(),
      source: vector_source(host, 'ne_10m_land')
    })
  ]
});

var base10_lyr_group_top = new Group({
  combine: true,
  visible: true,
  minZoom: 5,
  name: '10m',
  layers: [
    new VectorLayer({
      style: styles.lake_style(),
      source: vector_source(host, 'ne_50m_lakes')
    }),
    new VectorLayer({
      style: styles.coastline_style(),
      source: vector_source(host, 'ne_10m_land')
    }),
    new VectorLayer({
      style: styles.river_style(),
      source: vector_source(host, 'ne_50m_rivers')
    }),

    new VectorLayer({
      style: function (feature) {
        name = feature.get('name');
        var style = styles.city_style(name);
        return style;
      },
      source: vector_source(host, 'ne_50m_cities'),
      declutter: true
    }),
    new VectorLayer({
      style: function (feature) {
        name = feature.get('name');
        var style = styles.port_style(name);
        return style;
      },
      source: vector_source(host, 'ne_10m_ports'),
      declutter: true
    }),
  ]
});

var base10_lyr_group_bottom = new Group({
  combine: true,
  visible: true,
  minZoom: 5,
  name: '10m',
  layers: [
    new VectorLayer({
      style: styles.country_style(),
      source: vector_source(host, 'ne_10m_land')
    })
  ]
});

module.exports = {
  base110_lyr_group_top,
  base50_lyr_group_top,
  base10_lyr_group_top,
  base110_lyr_group_bottom,
  base50_lyr_group_bottom,
  base10_lyr_group_bottom,
}