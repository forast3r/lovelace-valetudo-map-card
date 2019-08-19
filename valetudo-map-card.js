class ValetudoMapCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  };

  calculateColor(container, ...colors) {
    for (let color of colors) {
      if (!color) continue;
      if (color.startsWith('--')) {
        let possibleColor = getComputedStyle(container).getPropertyValue(color);
        if (!possibleColor) continue;
        return possibleColor;
      };
      return color;
    };
  };

  drawMap(container, mapData) {
    // Calculate colours
    const floorColor = this.calculateColor(container, this._config.floor_color, '--valetudo-map-floor-color', '--secondary-background-color');
    const obstacleWeakColor = this.calculateColor(container, this._config.obstacle_weak_color, '--valetudo-map-obstacle-weak-color', '--divider-color');
    const obstacleStrongColor = this.calculateColor(container, this._config.obstacle_strong_color, '--valetudo-map-obstacle-strong-color', '--accent-color');
    const pathColor = this.calculateColor(container, this._config.path_color, '--valetudo-map-path-color', '--primary-text-color');

    // Delete previous map
    while (container.firstChild) {
      container.firstChild.remove();
    };

    const containerContainer = document.createElement('div');
    const containerContainerStyle = document.createElement('style');
    containerContainerStyle.textContent = `
      div {
        position: relative;
        margin-left: auto;
        margin-right: auto;
        width: ${mapData.attributes.image.dimensions.width}px;
        height: ${mapData.attributes.image.dimensions.height}px;
      }
      div canvas {
        position: absolute;
        background-color: transparent;
      }
    `
    container.appendChild(containerContainer);
    container.appendChild(containerContainerStyle);

    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = mapData.attributes.image.dimensions.width;
    mapCanvas.height = mapData.attributes.image.dimensions.height;
    mapCanvas.style.zIndex = 1;

    const pathCanvas = document.createElement('canvas');
    pathCanvas.width = mapData.attributes.image.dimensions.width;
    pathCanvas.height = mapData.attributes.image.dimensions.height;
    pathCanvas.style.zIndex = 2;

    containerContainer.appendChild(mapCanvas);
    containerContainer.appendChild(pathCanvas);

    const mapCtx = mapCanvas.getContext("2d");
    mapCtx.fillStyle = floorColor;
    for (let item of mapData.attributes.image.pixels.floor) {
      mapCtx.fillRect(item[0], item[1], 1, 1);
    };

    mapCtx.fillStyle = obstacleWeakColor;
    for (let item of mapData.attributes.image.pixels.obstacle_weak) {
      mapCtx.fillRect(item[0], item[1], 1, 1);
    };

    mapCtx.fillStyle = obstacleStrongColor;
    for (let item of mapData.attributes.image.pixels.obstacle_strong) {
      mapCtx.fillRect(item[0], item[1], 1, 1);
    };

    // TODO: Charger and vacuum

    if (mapData.attributes.path.points) {
      const pathCtx = pathCanvas.getContext("2d");
      const widthScale = 50;
      const heightScale = 50;
      const leftOffset = mapData.attributes.image.position.left;
      const topOffset = mapData.attributes.image.position.top;
      pathCtx.strokeStyle = pathColor;

      let first = true;
      pathCtx.beginPath();
      for (let item of mapData.attributes.path.points) {
        let x = Math.floor((item[0]) / widthScale) - leftOffset;
        let y = Math.floor((item[1]) / heightScale) - topOffset;
        if (first) {
          pathCtx.moveTo(x, y);
          first = false;
        } else {
          pathCtx.lineTo(x, y);
        };
      };
      pathCtx.stroke();
    };
  };

  setConfig(config) {
    let cardContainer = document.createElement('ha-card');

    while (this.shadowRoot.firstChild) {
      this.shadowRoot.firstChild.remove();
    };

    this.shadowRoot.appendChild(cardContainer);

    this._config = config;
  };

  set hass(hass) {
    this._hass = hass;
    const config = this._config;
    let mapEntity = this._hass.states[this._config.entity];
    if (!mapEntity) return;
    this.drawMap(this.shadowRoot.firstChild, mapEntity);
  };

  getCardSize() {
    return 1;
  };
}

customElements.define('valetudo-map-card', ValetudoMapCard);