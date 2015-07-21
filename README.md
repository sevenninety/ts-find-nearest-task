# ts-find-nearest-task
## A client-side Find Nearest Task for the Esri API for JavaScript written using TypeScript

This is an update to my original Find Nearest Task. The code is ported to TypeScript but the end product JavaScript task is still the same.

The repository is a task to perform a client-side find nearest using the Esri JS API. It currently works for
points, lines and polygons and finds the nearest feature, distance and nearest point (useful for debugging). It runs client-side and because it uses a FeatureService the geometries are local and therefore the code is fast to execute.

## Features
Client-side find nearest task for points, lines or polygons. Configurable number of features to return. Output is an array of nearest features, distances and nearest point. Works with either planar or geodesic spatial references. It can be used with or without a map. 



