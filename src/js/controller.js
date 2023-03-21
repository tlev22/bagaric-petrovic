import * as model from './model.js';

const svg = d3
	.select('#tree-container')
	.append('svg')
	.attr('width', '100vw')
	.attr('height', '100vh');

const g = svg.append('g').attr('transform', 'translate(50,50)');

const tree = d3.tree().size([100000, 2500]);

const root = d3.hierarchy(model.data);

tree(root);

const link = g
	.selectAll('.link')
	.data(root.descendants().slice(1))
	.enter()
	.append('path')
	.attr('class', 'link')
	.attr('d', function (d) {
		return (
			'M' +
			d.x +
			',' +
			d.y +
			'C' +
			d.x +
			',' +
			(d.y + d.parent.y) / 2 +
			' ' +
			d.parent.x +
			',' +
			(d.y + d.parent.y) / 2 +
			' ' +
			d.parent.x +
			',' +
			d.parent.y
		);
	});

const node = g
	.selectAll('.node')
	.data(root.descendants())
	.enter()
	.append('g')
	.attr('class', function (d) {
		return 'node' + (d.children ? ' node--internal' : ' node--leaf');
	})
	.attr('transform', function (d) {
		return 'translate(' + d.x + ',' + d.y + ')';
	});

node.append('circle').attr('r', 60);

const info = node.append('g').attr('text-anchor', 'middle');

info.append('text')
	.attr('dy', '-1em')
	.text(function (d) {
		return d.data.name;
	});

info.append('text')
	.attr('dy', '-0.7em')
	.style('text-anchor', 'middle')
	.style('dominant-baseline', 'hanging')
	.style('fill', 'black')
	.text(function (d) {
		return d.data.middleName ? d.data.middleName : '';
	});

info.append('text')
	.attr('dy', '.4em')
	.style('text-anchor', 'middle')
	.style('dominant-baseline', 'hanging')
	.style('fill', 'gray')
	.text(function (d) {
		return (
			(d.data.birth ? d.data.birth + ' -' : '') +
			(d.data.death ? d.data.death : '')
		);
	});

info.append('text')
	.attr('dy', '1.5em')
	.style('text-anchor', 'middle')
	.style('dominant-baseline', 'hanging')
	.style('fill', 'gray')
	.text(function (d) {
		return d.data.place ? d.data.place : '';
	});

info.append('text')
	.attr('dy', '2.8em')
	.style('text-anchor', 'middle')
	.style('dominant-baseline', 'hanging')
	.style('fill', 'gray')
	.text(function (d) {
		return d.data.country ? d.data.country : '';
	});

const zoom = d3.zoom().scaleExtent([0, 5]).on('zoom', zoomed);

svg.call(zoom);

function zoomed() {
	g.attr('transform', d3.event.transform);
}
