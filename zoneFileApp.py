from flask import Flask, render_template, Response, make_response

import json
import pandas as pd
import numpy as np
from flask import jsonify
import networkx as nx
import json
from networkx.readwrite import json_graph
import re
import subprocess
import ssl
from urllib.request import urlopen
import geoip2.database


jsonGraphFile = './static/data/graph.json'
jsonSubGraphFile = './static/data/subgraph.json'
app = Flask(__name__)


def ipGeo2Location(ip):
    reader = geoip2.database.Reader(
        './static/data/GeoLite2-Country.mmdb')
    return reader.country(ip).country.name


def dotCom(domain):
    return domain + '.com'


def digCMD(label):
    sslContext = ssl.SSLContext(ssl.PROTOCOL_TLSv1)

    response = urlopen('http://netstats-util.herokuapp.com/dig/' +
                       label)
    ip = json.load(response)

    if len(ip) == 0:
        ip = 'None'

    if len(ip) >= 1 and not ip[0]:
        geoInfo = ipGeo2Location(ip[0])
    else:
        geoInfo = 'None'

    return json.dumps([ip, geoInfo])


def bigrams(keyWord=''):
    try:

        output = subprocess.check_output(
            ['./bigrams', '-q', '-e', '1.0', '-d', '-r', 'commbank', '-t', keyWord])
        return json.dumps(output.decode('utf-8').split('\n')[-2].split(',')[0])
    except subprocess.CalledProcessError:
        print('error')


def extractColumn(name, df):
    item_list = df[name].tolist()
    print('numbers of items: ' + str(len(item_list)))
    item_list_unique = list(set(item_list))
    print('numbers of unique items: ' + str(len(item_list_unique)))
    return item_list_unique


def createGraph(file=''):

    df = pd.read_csv(file)
    domain_list_unique = extractColumn('domain', df)
    ns_list_unique = extractColumn('NS', df)

    G = nx.Graph()

    G.add_nodes_from(domain_list_unique, color='red')
    G.add_nodes_from(ns_list_unique, color='blue')

    edges_list = []
    for index, row in df.iterrows():
        edges_list.append((row['domain'], row['NS']))
    print('numbers of edges: ' + str(len(edges_list)))
    print('numbers of unique edges: ' + str(len(list(set(edges_list)))))

    for i in edges_list:
        G.add_edge(*i)

    for n in G:
        G.node[n]['name'] = n

    return G
# save to json


def graphTojsonFile(G):

    for n in G:
        G.node[n]['name'] = n

    d = json_graph.node_link_data(G)
    json.dump(d, open(jsonGraphFile, 'w'))
    return d


def subgraphTojson(G, nGraph):
    sub_graphs = nx.connected_component_subgraphs(G)
    subG = nx.Graph()
    sub_graphs_list = []

    for i, sg in enumerate(sub_graphs):
        sub_graphs_list.append(sg)

        sub_graphs_list = sub_graphs_list[:nGraph]

    subG = nx.Graph()
    for i, sg in enumerate(sub_graphs_list):
        print('Graph: {:d}, NodeNum: {:d}'.format(i, sg.number_of_nodes()))
        subG = nx.compose(subG, sg)

    return json.dumps(json_graph.node_link_data(subG))


def jsonToGraph(fileName):
    with open(fileName) as f:
        js_graph = json.load(f)
    return json_graph.node_link_graph(js_graph)


def POIGraph(G, label):
    sub_graphs = nx.connected_component_subgraphs(G)
    for i, sg in enumerate(sub_graphs):
        for n in sg:
            if G.node[n]['name'] == label:
                return json.dumps(json_graph.node_link_data(sg))


def getGraphStatsByLabel(label):

    sub_graphs = nx.connected_component_subgraphs(G)
    graphStat = {'numNodes': 0, 'numEdges': 0, 'radius': 0, 'diameter': 0,
                 'eccentricity': 0, 'center': 0, 'periphery': 0, 'density': 0}
    for i, sg in enumerate(sub_graphs):
        for n in sg:
            if G.node[n]['name'] == label:
                graphStat['numNodes'] = sg.number_of_nodes()
                graphStat['numEdges'] = sg.number_of_edges()
                graphStat['radius'] = nx.radius(sg)
                graphStat['diameter'] = nx.diameter(sg)
                graphStat['eccentricity'] = nx.eccentricity(sg)
                graphStat['center'] = nx.center(sg)
                graphStat['periphery'] = nx.periphery(sg)
                graphStat['density'] = nx.density(sg)

                return json.dumps(graphStat)


G = createGraph('./static/data/INVESTMENTS.csv')
#G = createGraph('./static/data/INVESTMENTS_GEO.csv')

# graphTojsonFile(G)


@app.route('/dig')
@app.route('/dig/<label>')
def dig(label='-h'):
    return digCMD(label)


@app.route('/POIbigrams')
@app.route('/POIbigrams/<label>')
def POIbigrams(label=''):
    return bigrams(label)


@app.route('/POIGraph')
@app.route('/POIGraph/<label>')
def subGraphByLabel(label=''):
    return POIGraph(G, label)


@app.route('/POIStats/<label>')
def POInumNodes(label=''):
    return getGraphStatsByLabel(label)


@app.route('/subgraph')
@app.route('/subgraph/<int:nGraph>')
def subgraph(nGraph=1):
    return subgraphTojson(G, nGraph)


@app.route('/subgraphNum')
def subgraphNum():
    return json.dumps(computeSubgraphNum(jsonToGraph(jsonGraphFile)))


@app.route('/zoneNodes')
@app.route('/zoneNodes/<int:ndata>')
def zonejson(ndata=100):
    print(str(ndata))
    with open(jsonGraphFile) as f:
        zonejson = json.load(f)

    return json.dumps(zonejson[:ndata])


@app.route('/allzoneNodes')
def allZonejson():
    with open(jsonGraphFile) as f:
        allzonejson = json.load(f)
    return json.dumps(allzonejson)


@app.route('/worldmap')
def worldMapjson():
    with open('./static/data/world.json') as f:
        worldMapjson = json.load(f)
    return json.dumps(worldMapjson)


@app.route('/')
@app.route('/index')
def index():
    return render_template('subgraph.html')


def main():

    app.run(threaded=True,
            host='127.0.0.1')

if __name__ == '__main__':
    main()
