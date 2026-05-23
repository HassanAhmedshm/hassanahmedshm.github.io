Earth Textures for Solar System Viewer
======================================

This directory should contain Earth texture files used by the SolarSystemViewer component.

Required Files:
---------------
1. earth-blue-marble.jpg - Blue marble Earth texture (main surface)
2. earth-topology.png    - Earth topology/height map (optional, for elevation)
3. earth-clouds.png      - Earth clouds texture (optional, for cloud layer)

Download Sources:
-----------------
These textures can be downloaded from the three-globe package:

- https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg
- https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png
- https://unpkg.com/three-globe@2.31.1/example/img/earth-clouds.png

Alternative Sources:
--------------------
- NASA Visible Earth: https://visibleearth.nasa.gov/
- Natural Earth: https://www.naturalearthdata.com/

Fallback Behavior:
------------------
If these files are not present, the SolarSystemViewer component will
automatically fall back to loading textures from the CDN.

Note: The earth-blue-marble.jpg is the primary texture. The topology and
clouds textures are optional enhancements.