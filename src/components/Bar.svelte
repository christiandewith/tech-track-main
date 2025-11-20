<script>
  import * as d3 from "d3";
  import { onMount } from 'svelte';
  import { getCleanedTopScorers } from '$lib/dataClean.js';





onMount(async () => {

  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };

  // Await the cleaned data (getCleanedTopScorers is async)
  const data = await getCleanedTopScorers();

  // Guard: ensure we have an array
  const safeData = Array.isArray(data) ? data : [];

  // Compute extents with sensible fallbacks if data is empty
  const goalsExtent = d3.extent(safeData, d => d.goals);
  const assistsExtent = d3.extent(safeData, d => d.assists);
  const xDomain = (goalsExtent && goalsExtent[0] != null) ? goalsExtent : [0, 1];
  const yDomain = (assistsExtent && assistsExtent[0] != null) ? assistsExtent : [0, 1];

  // Scales
  const xScale = d3.scaleLinear()
    .domain(xDomain)
    .nice()
    .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear()
    .domain(yDomain)
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Select SVG
  const svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height);

  // Clear any previous axes / content
  svg.selectAll('.axis').remove();

  // X Axis
  svg.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

  // Y Axis
  svg.append('g')
    .attr('class', 'axis axis--y')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));

});
</script>

