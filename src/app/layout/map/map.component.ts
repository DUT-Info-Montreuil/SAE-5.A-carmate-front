import { Component, ElementRef, ViewChild, Input, SimpleChanges } from '@angular/core';
import { Map, View, Feature } from 'ol';
import { OSM } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { Extent, boundingExtent } from 'ol/extent';
import { Style, Icon } from 'ol/style';
import { Point } from 'ol/geom';
import { defaults } from 'ol/control/defaults';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent {
  @ViewChild('map', { static: true }) mapElement: ElementRef = new ElementRef(null);
  @Input() _starting_pointDriver: number[] = [0, 0];
  @Input() _starting_pointUser: number[] = [0, 0];
  map!: Map;
  readonly userIconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 500],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: 'assets/user-icon.png',
      scale: 0.1
    })
  });
  readonly driverIconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 500],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: 'assets/driver-icon.png',
      scale: 0.1
    })
  });

  ngOnInit() {
    this.map = new Map({
      target: this.mapElement.nativeElement,
      layers: [
        new TileLayer({
          preload: 5,
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([...this._starting_pointUser].reverse()),
        zoom: 5,
        maxResolution: 80,
        minResolution: 0.5
      }),
      controls: defaults({
        attributionOptions: {
          collapsible: false
        }
      })
    });
    this.addLayerIcon([...this._starting_pointUser].reverse(), this.userIconStyle);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['_starting_pointDriver'] && changes['_starting_pointDriver'].currentValue !== changes['_starting_pointDriver'].previousValue) {
      const extent = boundingExtent([[...this._starting_pointDriver].reverse(), [...this._starting_pointUser].reverse()]);
      this.updateMap(extent);

      this.map.getAllLayers().forEach((layer) => {
        if(layer.getProperties()['name'] === 'driver') {
          this.map.removeLayer(layer);
        }
        this.addLayerIcon([...this._starting_pointDriver].reverse(), this.driverIconStyle);
      });
    }

    if(changes['_starting_pointUser'] && this._starting_pointDriver && changes['_starting_pointUser'].currentValue !== changes['_starting_pointUser'].previousValue) {
      const extent = boundingExtent([[...this._starting_pointDriver].reverse(), [...this._starting_pointUser].reverse()]);
      this.updateMap(extent);

      this.map.getAllLayers().forEach((layer) => {
        if(layer.getProperties()['name'] === 'user') {
          this.map.removeLayer(layer);
          this.addLayerIcon([...this._starting_pointUser].reverse(), this.userIconStyle);
        }
      });
    }
  }

  private addLayerIcon(coordinates: number[], styleIcon: Style) {
    const iconFeature = new Feature({
      geometry: new Point(fromLonLat(coordinates)),
      name: 'Votre Icône'
    });

    iconFeature.setStyle(styleIcon);

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [iconFeature]
      })
    });

    vectorLayer.setProperties({name: styleIcon === this.userIconStyle ? 'user' : 'driver'});

    this.map.addLayer(vectorLayer);
  }

  private updateMap(extent: Extent) {
    const sw = fromLonLat([ extent[0], extent[1] ]);
    const ne = fromLonLat([ extent[2], extent[3] ]);

    this.map.getView().fit([ sw[0], sw[1], ne[0], ne[1] ],{
      duration: 1000,
      padding: [100, 100, 50, 100],
    });
  }

}
