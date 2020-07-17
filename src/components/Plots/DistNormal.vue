<template>
  <div>
    <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>
  </div>

</template>

<script>
    let { jStat } = require('jstat');
    import VueApexCharts from 'vue-apexcharts'

    function linspace(a,b,n) {
        if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
        if(n<2) { return n===1?[a]:[]; }
        var i,ret = Array(n);
        n--;
        for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
        return ret;
    }

    function * zip(arr1, arr2, i = 0) {
        while(arr1[i]) yield [ arr1[i], arr2[i++] ];
    }



    export default {
        components: {
            apexchart: VueApexCharts,
        },
        name: "DistNormal",
        data() {
          return {
            series: [{
                name: 'series1',
                data: [ ...zip(linspace(-3, 3, 20), linspace(-3, 3, 20).map(x => jStat.normal.pdf(x, 0, 1))) ]
            }],
            chartOptions: {
                grid: {
                  show: false
                },
                chart: {
                    height: 150,
                    type: 'area'
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    show: true,
                    width: 2,
                    curve: 'smooth'
                },
                xaxis: {
                    type: 'numeric',
                },
            },
          }
        },
    }
</script>

<style scoped>

</style>