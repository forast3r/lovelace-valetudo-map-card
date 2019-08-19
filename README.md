# Lovelace Valetudo Map Card

Draws the map available from a Xiaomi Vacuum cleaner flashed with [Valetudo](https://github.com/Hypfer/Valetudo) in a [Home Assistant](https://www.home-assistant.io/) Lovelace card.

## Configuration 

lovelace.yaml:
```yaml
resources:
  - type: js
    url: /community_plugin/lovelace-valetudo-map-card/valetudo-map-card.js
```

configuration.yaml:
```yaml
sensor:
  - platform: rest
    resource: http://ip_of_your_vacuum/api/map/latest
    name: xiaomi_map
    json_attributes:
      - image
      - path
      - charger
      - robot
    value_template: 'OK'
```

Card:
```yaml
type: 'custom:valetudo-map-card'
entity: sensor.xiaomi_map
```

## Options
| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:valetudo-map-card`
| entity | string | **Required** | Sensor to get state from
| floor_color | string | '--valetudo-map-floor-color', '--secondary-background-color' | Floor color
| obstacle_weak_color | string | '--valetudo-map-obstacle-weak-color', '--divider-color' | Weak obstacle color
| obstacle_strong_color | string | '--valetudo-map-obstacle-strong-color', '--accent-color' | Strong obstacle color
| path_color | string | '--valetudo-map-path-color', '--primary-text-color' | Path color