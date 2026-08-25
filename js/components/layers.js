import colorbrewer from 'colorbrewer';
import GeoJSON from 'ol/format/GeoJSON';
import { Group, Vector as VectorLayer } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';
import { Fill, Stroke, Style } from 'ol/style';


var styles = require('../appearence/styles');
var fun = require('./functions');

var host = "http://localhost:8080";

function vector_source(host, name) {
  return new VectorSource({
    format: new GeoJSON(),
    url: `${host}/${name}.geojson`
  });
}

var hs_lyr_group = new Group({
  combine: true,
  visible: true,
  title: 'Значительная высота волны',
  name: 'hs',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.RdPu, z, 0, 18, 1)
          })
        })
      },
      source: vector_source(host, 'hs_band_big')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'hs_iso_big')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'hs_iso_big')
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.RdPu, z, 0, 18, 1)
          })
        })
      },
      source: vector_source(host, 'azov_10_hsig_plg')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'azov_10_hsig_iso')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'azov_10_hsig_iso')
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.RdPu, z, 0, 18, 1)
          })
        })
      },
      source: vector_source(host, 'maxs_02_50_plg_ws')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'maxs_02_50_iso_ws')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'maxs_02_50_iso_ws')
    })
  ]
})

var h3p_lyr_group = new Group({
  combine: true,
  visible: true,
  title: 'Значительная высота волны',
  name: 'h3p',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuRd, z, 0, 26, 2)
          })
        })
      },
      source: vector_source(host, 'h3p_band')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'h3p_cont')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'h3p_cont')
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuRd, z, 0, 26, 2)
          })
        })
      },
      source: vector_source(host, 'dv_h1p_plg')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'dv_h1p_ln')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'dv_h1p_ln')
    })
  ]
});

// color crutch
var hsr_colors = fun.get_colors(colorbrewer.OrRd, 0, 3.2, 0.2);
var bin_number = function (z, min, step) {
  var bin_num = Math.floor((z - min) / step);
  return bin_num
}

var hsr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'hsr',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            // color: fun.get_color(colorbrewer.OrRd, z, 0, 2.6, 0.2)
            color: hsr_colors[bin_number(z, 0, 0.2)]
          })
        })
      },
      source: vector_source(host, 'hsr_band')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'hsr_cont')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'hsr_cont')
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            // color: fun.get_color(colorbrewer.OrRd, z, 0, 2.6, 0.2)
            color: hsr_colors[bin_number(z, 0, 0.2)]
          })
        })
      },
      source: vector_source(host, 'azov_10_hsr_plg')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'azov_10_hsr_iso')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'azov_10_hsr_iso')
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: hsr_colors[bin_number(z, 0, 0.2)]
          })
        })
      },
      source: vector_source(host, 'hsr_plg_dv')
    })
    ,
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'hsr_iso_dv')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'hsr_iso_dv')
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: hsr_colors[bin_number(z, 0, 0.2)]
          })
        })
      },
      source: vector_source(host, 'hsr_02_50_plg_ws')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'hsr_02_50_iso_ws')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'hsr_02_50_iso_ws')
    }),
  ]
});



var lsr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'lsr',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.Blues, z, 0, 140, 10)
          })
        })
      },
      source: vector_source(host, 'lsr_band')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'lsr_cont')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'lsr_cont')
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.Blues, z, 0, 140, 10)
          })
        })
      },
      source: vector_source(host, 'azov_10_lsr_plg')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'azov_10_lsr_iso')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'azov_10_lsr_iso')
    })
  ]
});




var psr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'psr',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.Greens, z, 0, 7, 0.5)
          })
        })
      },
      source: vector_source(host, 'psr_band')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'psr_cont')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'psr_cont')
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.Greens, z, 0, 7, 0.5)
          })
        })
      },
      source: vector_source(host, 'azov_10_psr_plg')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'azov_10_psr_iso')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'azov_10_psr_iso')
    })
  ]
});

var esr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'esr',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGnBu, z, 0, 65, 5)
          })
        })
      },
      source: vector_source(host, 'esr_02_50_plg')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'esr_02_50_iso')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'esr_02_50_iso')
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGnBu, z, 0, 65, 5)
          })
        })
      },
      source: vector_source(host, 'azov_10_esr_plg')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'azov_10_esr_iso')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'azov_10_esr_iso')
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGnBu, z, 0, 65, 5)
          })
        })
      },
      source: vector_source(host, 'esr_02_50_plg_ws')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'esr_02_50_iso_ws')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'esr_02_50_iso_ws')
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGnBu, z, 0, 65, 5)
          })
        })
      },
      source: vector_source(host, 'esr_band')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'esr_cont')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'esr_cont')
    })
  ]
});




var emax_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'emax',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlOrBr, z, 0, 4000, 250)
          })
        })
      },
      source: vector_source(host, 'azov_10_emax_plg')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'azov_10_emax_iso')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'azov_10_emax_iso')
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlOrBr, z, 0, 4000, 250)
          })
        })
      },
      source: vector_source(host, 'emax_plg')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'emax_iso')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'emax_iso')
    })
  ]
});





var osr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'osr',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('Z_MEAN');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGn, z, 0, 100, 10)
          })
        })
      },
      source: vector_source(host, 'osr_band')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'osr_cont')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'osr_cont')
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGn, z, 0, 100, 10)
          })
        })
      },
      source: vector_source(host, 'osr_plg')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'osr_iso')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'osr_iso')
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGn, z, 0, 100, 10)
          })
        })
      },
      source: vector_source(host, 'obesp_02_50_plg_ws')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'obesp_02_50_iso_ws')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'obesp_02_50_iso_ws')
    })
  ]
});

var wind_grp_50_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'psr',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuBuGn, z, 0, 900, 100)
          })
        })
      },
      source: vector_source(host, 'wind_grp50_band')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wind_grp50_cont')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wind_grp50_cont')
    })
  ]
});

var wind_grp_100_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'psr',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuBuGn, z, 0, 1100, 100)
          })
        })
      },
      source: vector_source(host, 'wind_grp100_band')
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wind_grp100_cont')
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wind_grp100_cont')
    })
  ]
});

var wind_grp_50c_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'grp_50',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var sea = feature.get('layer');
        var conflict = feature.get('overlap');
        if (!(conflict == 1 && sea == 'barentsz_wind')) {
          var z = feature.get('grp_50');
          return new Style({
            fill: new Fill({
              color: fun.get_color(colorbrewer.PuBuGn, z, 0, 1800, 100)
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 0.1
            })
          })
        }
      },
      source: vector_source(host, 'grpandblackwind')
    })
  ]
});

var wind_grp_100c_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'grp_100',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var sea = feature.get('layer');
        var conflict = feature.get('overlap');
        if (!(conflict == 1 && sea == 'barentsz_wind')) {
          var z = feature.get('grp_100');
          return new Style({
            fill: new Fill({
              color: fun.get_color(colorbrewer.PuBuGn, z, 0, 1800, 100)
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 0.1
            })
          })
        }
      },
      source: vector_source(host, 'grpandblackwind')
    })
  ]
});

var wind_spd_50c_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'wind_spd_50c_lyr_group',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('spd_50');
        if (z != null) {
          return new Style({
            fill: new Fill({
              color: fun.get_color(colorbrewer.PuBuGn, z, 0, 12, 1)
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 0.1
            })
          })
        }
      },
      source: vector_source(host, 'grpandblackwind')
    })
  ]
});

var wind_spd_100c_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'wind_spd_100c_lyr_group',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('spd_100');
        if (z != null) {
          return new Style({
            fill: new Fill({
              color: fun.get_color(colorbrewer.PuBuGn, z, 0, 12, 1)
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 0.1
            })
          })
        }
      },
      source: vector_source(host, 'grpandblackwind')
    })
  ]
});


module.exports = {
  hs_lyr_group,
  h3p_lyr_group,
  hsr_lyr_group,
  lsr_lyr_group,
  psr_lyr_group,
  esr_lyr_group,
  emax_lyr_group,
  osr_lyr_group,
  wind_grp_50_lyr_group,
  wind_grp_100_lyr_group,
  wind_grp_50c_lyr_group,
  wind_grp_100c_lyr_group,
  wind_spd_50c_lyr_group,
  wind_spd_100c_lyr_group,
}
