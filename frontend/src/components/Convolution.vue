<template>
  <v-card>
    <v-card-title class="primary--text">Convolution</v-card-title>
    <v-btn @click="sfm(rc)">
      Convolve
    </v-btn>
    <canvas id="seis"></canvas>
  </v-card>
</template>

<script>
  function arange(start, end, step) {
    let range = [];
    for (let x = start; x < end; x += step) {
      range.push(x)
    }
    return range
  }

  function ricker(duration, dt, frequency) {
    let t = arange(-duration / 2, duration / 2, dt)
    let pft2 = [];
    t.forEach((value) => {
      pft2.push((Math.PI * frequency * value)**2)
    })
    let w = [];
    pft2.forEach((value) => {
      w.push((1 - 2 * value) * Math.E**(-value))
    })
    return w
  }

  /* Returns the discrete, linear convolution of two vectors.
  ** Convolution in time/space is equivalent to multiplication in the frequency domain.
  This function is equivalent to numpy's convolve function with the default 'full' parameter
  example :
  ------
  vec1 = [2,3,4]
  vec2 = [1,2,3]
  multiply vec2 by vec1[0] = 2    4   6
  multiply vec2 by vec1[1] = -    3   6   9
  multiply vec2 by vec1[2] = -    -   4   8   12
  -----------------------------------------------
  add the above three      = 2    7   16  17  12
  convolve(vec1, vec2) // [2,7,16,17,12]
  **
  */

  function convolve(vec1, vec2) {
    if (vec1.length === 0 || vec2.length === 0) {
      throw new Error("Vectors can not be empty!");
    }
    const volume = vec1;
    const kernel = vec2;
    let displacement = 0;
    const convVec = [];

    for (let i = 0; i < volume.length; i++) {
      for (let j = 0; j < kernel.length; j++) {
        if (displacement + j !== convVec.length) {
          convVec[displacement + j] =
            convVec[displacement + j] + volume[i] * kernel[j];
        } else {
          convVec.push(volume[i] * kernel[j]);
        }
      }
      displacement++;
    }

    return convVec;
  }

  function prepareCanvas(canvasId, shape) {
    let canvasX = shape[0];
    let canvasY = shape[1];
    let canvas = document.getElementById(canvasId)
    canvas.width = canvasX;
    canvas.height = canvasY;
    let ctx = canvas.getContext("2d");
    let imageData = ctx.getImageData(0, 0, canvasX, canvasY);
    let buffer = new ArrayBuffer(imageData.data.length);
    let buffer8 = new Uint8ClampedArray(buffer);
    let data = new Uint32Array(buffer);
    return {ctx, buffer8, data, imageData}
  }

  export function drawSection(canvasId, section, shape, cmap) {
    let {ctx, buffer8, data, imageData} = prepareCanvas(canvasId, shape)

    let colormap = require('colormap');
    let colors = colormap({
      colormap: cmap,  // TODO: get colormap from state
      nshades: 254, // TODO: get nlayers for cmap from state
      format: 'rgba',
      alpha: 1
    })
    for (let x = 0; x < shape[0]; x += 1) {
      for (let y = 0; y < shape[1]; y += 1) {
        let c = colors[section[y][x]];
        data[y * shape[0] + x] =
          (c[3] * 255 << 24) |    // alpha
          (c[2] << 16) |          // blue
          (c[1] <<  8) |          // green
          c[0];                  // red
      }
    }
    imageData.data.set(buffer8);
    ctx.putImageData(imageData, 0, 0)
  }

  export default {
    name: 'Convolution',
    data() {
      return {
        seismic: undefined
      }
    },
    computed: {
      rc: {
        get() {
          return this.$store.state.previewSeismic[0]
        }
      }
    },
    methods: {
      sfm(rc) {
        let seismic = [];
        let wavelet = ricker(0.08, 0.002, 30);
        for (let col = 0; col < rc.length; col += 1) {
          let column = rc[col];
          let seiscol = convolve(column, wavelet)
          seismic.push(seiscol)
        }
        this.seismic = seismic
      }
    }
  }
</script>