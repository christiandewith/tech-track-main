<script>
  import * as d3 from "d3";
  import { onMount } from 'svelte';
  import { getCleanedTopScorers } from '$lib/dataClean.js';

  onMount(async () => {
    // Chart dimensions
    const width = 1400;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };

    // Fetch player data
    const players = await getCleanedTopScorers();
    if (!Array.isArray(players) || players.length === 0) return;

    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(players, d => d.goals))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(players, d => d.assists))
      .range([height - margin.bottom, margin.top]);

    // Setup SVG
    const svg = d3.select('svg')
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('.axis').remove();

    // Add X axis (goals)
    svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    // Add Y axis (assists) with integer ticks only
    const [yMin, yMax] = yScale.domain();
    const yTicks = d3.range(Math.floor(yMin), Math.ceil(yMax) + 1);

    svg.append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickValues(yTicks).tickFormat(d3.format('d')));
    
    // Axis labels
    // X label: Goals (centered under the axis)
    svg.append('text')
      .attr('class', 'axis-label axis-label--x')
      .attr('x', (width) / 2)
      .attr('y', height - 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .text('Goals');

    // Y label: Assists (rotated, centered along the axis)
    svg.append('text')
      .attr('class', 'axis-label axis-label--y')
      .attr('transform', `rotate(-90)`)
      .attr('x', -(height / 2))
      .attr('y', 16)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .text('Assists');
    
    // Add club logos
    const logoSize = 30;
    const logoSizeHover = 40;

    svg.selectAll('.player-logo')
      .data(players)
      .join('image')
      .attr('class', 'player-logo')
      .attr('x', d => xScale(d.goals) - logoSize/2)
      .attr('y', d => yScale(d.assists) - logoSize/2)
      .attr('width', logoSize)
      .attr('height', logoSize)
      .attr('href', d => d.logo)
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('width', logoSizeHover)
          .attr('height', logoSizeHover)
          .attr('x', d => xScale(d.goals) - logoSizeHover/2)
          .attr('y', d => yScale(d.assists) - logoSizeHover/2)
          .attr('opacity', 1);
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('width', logoSize)
          .attr('height', logoSize)
          .attr('x', d => xScale(d.goals) - logoSize/2)
          .attr('y', d => yScale(d.assists) - logoSize/2)
          .attr('opacity', 0.8);
      });

    // Add player name labels below logos
    svg.selectAll('.player-label')
      .data(players)
      .join('text')
      .attr('class', 'player-label')
      .attr('x', d => xScale(d.goals))
      .attr('y', d => yScale(d.assists) + 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#e55838')
      .attr('pointer-events', 'none')
      .text(d => d.lastname);
  });
</script>

<svg></svg>
