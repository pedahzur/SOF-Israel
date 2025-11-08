"""
SOFS Appendix Data Dashboard
Interactive dashboard for Israeli Special Forces historical data
"""

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import dash
from dash import dcc, html, dash_table
from dash.dependencies import Input, Output
import os
from datetime import datetime

# Initialize the Dash app
app = dash.Dash(__name__, suppress_callback_exceptions=True)
app.title = "SOFS Appendix - Military Historical Data Dashboard"

# Load data
def load_data():
    """Load all CSV files from the repository"""
    data = {}

    try:
        # Load main datasets
        data['iaf_losses'] = pd.read_csv('IAF_1973_Losses.csv', encoding='utf-8-sig')
        data['units_full'] = pd.read_csv('UNITSN_194.csv', encoding='utf-8-sig')
        data['units_longevity'] = pd.read_csv('UNITSLongevityN_90.csv', encoding='utf-8-sig')
        data['units_glossary'] = pd.read_csv('Units Glossary-Grid.csv', encoding='utf-8-sig')
        data['attrition_ops'] = pd.read_csv('attrition_operations.csv', encoding='utf-8-sig')
        data['individuals'] = pd.read_csv('individuals_global.csv', encoding='utf-8-sig')
        data['individuals_glossary'] = pd.read_csv('individuals_glossary.csv', encoding='utf-8-sig')
        data['palyam_ops'] = pd.read_csv('palyam_operations1939-1948.csv', encoding='utf-8-sig')
        data['prestate_units'] = pd.read_csv('prestate_units.csv', encoding='utf-8-sig')
        data['regional_defensive'] = pd.read_csv('regional_defensive.csv', encoding='utf-8-sig')
        data['reprisals'] = pd.read_csv('reprisals.csv', encoding='utf-8-sig')
        data['sayeret_matkal'] = pd.read_csv('sayeret_matkal_birds.csv', encoding='utf-8-sig')
    except Exception as e:
        print(f"Error loading data: {e}")

    return data

# Load all data
data = load_data()

# Create visualizations
def create_iaf_losses_chart(df):
    """Create IAF losses visualization"""
    if df.empty:
        return go.Figure()

    fate_counts = df['Fate'].value_counts()
    fig = px.pie(
        values=fate_counts.values,
        names=fate_counts.index,
        title='IAF 1973 Losses by Fate',
        color_discrete_sequence=px.colors.sequential.RdBu
    )
    return fig

def create_operations_timeline(df):
    """Create operations timeline"""
    if df.empty:
        return go.Figure()

    # Parse dates
    df['DATE'] = pd.to_datetime(df['DATE'], errors='coerce')
    df_sorted = df.dropna(subset=['DATE']).sort_values('DATE')

    fig = px.scatter(
        df_sorted,
        x='DATE',
        y='SCALE',
        hover_data=['NAME', 'Location', 'Type of Operation'],
        title='Attrition Operations Timeline (1967-1973)',
        color='Branch',
        size_max=15
    )
    fig.update_layout(height=500)
    return fig

def create_units_longevity_chart(df):
    """Create units longevity visualization"""
    if df.empty:
        return go.Figure()

    df_sorted = df.sort_values('Overall Longevity', ascending=True)

    fig = px.bar(
        df_sorted,
        x='Overall Longevity',
        y='ID',
        title='Unit Longevity (Years)',
        orientation='h',
        color='Fate',
        hover_data=['Size', 'Status', 'Entrepreneur']
    )
    fig.update_layout(height=600)
    return fig

def create_reprisals_map(df):
    """Create map of reprisal operations"""
    if df.empty:
        return go.Figure()

    df_clean = df.dropna(subset=['Latitude', 'Longitude'])

    fig = px.scatter_mapbox(
        df_clean,
        lat='Latitude',
        lon='Longitude',
        hover_name='Operation Name',
        hover_data=['Date - Translated', 'Place', 'Desciption'],
        title='Reprisal Operations Map (1953+)',
        zoom=7,
        height=600
    )
    fig.update_layout(mapbox_style="open-street-map")
    return fig

def create_casualties_chart(df_iaf, df_attrition):
    """Create casualties overview"""
    fig = make_subplots(
        rows=1, cols=2,
        subplot_titles=('IAF Losses by Weapon Type', 'Operation Scale Distribution')
    )

    # IAF losses by weapon
    if not df_iaf.empty and 'Weapon' in df_iaf.columns:
        weapon_counts = df_iaf['Weapon'].value_counts().head(10)
        fig.add_trace(
            go.Bar(x=weapon_counts.index, y=weapon_counts.values, name='Weapon'),
            row=1, col=1
        )

    # Operation scale
    if not df_attrition.empty and 'SCALE' in df_attrition.columns:
        scale_counts = df_attrition['SCALE'].value_counts()
        fig.add_trace(
            go.Bar(x=scale_counts.index, y=scale_counts.values, name='Scale'),
            row=1, col=2
        )

    fig.update_layout(height=400, showlegend=False)
    return fig

# Create the layout
app.layout = html.Div([
    html.Div([
        html.H1("SOFS Appendix - Military Historical Data Dashboard",
                style={'textAlign': 'center', 'color': '#2c3e50', 'marginBottom': 30}),
        html.P("Interactive visualization of Israeli Special Forces historical data",
               style={'textAlign': 'center', 'color': '#7f8c8d', 'fontSize': 18})
    ], style={'backgroundColor': '#ecf0f1', 'padding': '20px', 'marginBottom': '30px'}),

    # Tabs for different sections
    dcc.Tabs([
        # Overview Tab
        dcc.Tab(label='Overview', children=[
            html.Div([
                html.H2("Key Metrics", style={'color': '#2c3e50'}),
                html.Div([
                    html.Div([
                        html.H3(str(len(data.get('attrition_ops', pd.DataFrame()))),
                                style={'color': '#e74c3c', 'fontSize': 48}),
                        html.P("Attrition Operations", style={'color': '#7f8c8d'})
                    ], className='metric-box'),
                    html.Div([
                        html.H3(str(len(data.get('iaf_losses', pd.DataFrame()))),
                                style={'color': '#3498db', 'fontSize': 48}),
                        html.P("IAF Aircraft Lost (1973)", style={'color': '#7f8c8d'})
                    ], className='metric-box'),
                    html.Div([
                        html.H3(str(len(data.get('reprisals', pd.DataFrame()))),
                                style={'color': '#2ecc71', 'fontSize': 48}),
                        html.P("Reprisal Operations", style={'color': '#7f8c8d'})
                    ], className='metric-box'),
                    html.Div([
                        html.H3(str(len(data.get('units_longevity', pd.DataFrame()))),
                                style={'color': '#f39c12', 'fontSize': 48}),
                        html.P("Elite Units Tracked", style={'color': '#7f8c8d'})
                    ], className='metric-box'),
                ], style={'display': 'flex', 'justifyContent': 'space-around', 'marginBottom': 30}),

                html.Div([
                    html.Div([
                        dcc.Graph(figure=create_casualties_chart(
                            data.get('iaf_losses', pd.DataFrame()),
                            data.get('attrition_ops', pd.DataFrame())
                        ))
                    ], style={'width': '100%'})
                ])
            ], style={'padding': '20px'})
        ]),

        # IAF Losses Tab
        dcc.Tab(label='IAF 1973 Losses', children=[
            html.Div([
                html.H2("IAF Yom Kippur War Losses", style={'color': '#2c3e50'}),
                dcc.Graph(figure=create_iaf_losses_chart(data.get('iaf_losses', pd.DataFrame()))),
                html.H3("Detailed Data", style={'marginTop': 30}),
                dash_table.DataTable(
                    data=data.get('iaf_losses', pd.DataFrame()).to_dict('records'),
                    columns=[{"name": i, "id": i} for i in data.get('iaf_losses', pd.DataFrame()).columns],
                    page_size=15,
                    style_table={'overflowX': 'auto'},
                    style_cell={'textAlign': 'left', 'padding': '10px'},
                    style_header={'backgroundColor': '#3498db', 'color': 'white', 'fontWeight': 'bold'},
                    style_data={'backgroundColor': '#ecf0f1'},
                    filter_action='native',
                    sort_action='native'
                )
            ], style={'padding': '20px'})
        ]),

        # Operations Tab
        dcc.Tab(label='Military Operations', children=[
            html.Div([
                html.H2("Attrition Operations (1967-1973)", style={'color': '#2c3e50'}),
                dcc.Graph(figure=create_operations_timeline(data.get('attrition_ops', pd.DataFrame()))),

                html.H3("Operations Data", style={'marginTop': 30}),
                dash_table.DataTable(
                    data=data.get('attrition_ops', pd.DataFrame()).to_dict('records'),
                    columns=[{"name": i, "id": i} for i in data.get('attrition_ops', pd.DataFrame()).columns],
                    page_size=15,
                    style_table={'overflowX': 'auto'},
                    style_cell={'textAlign': 'left', 'padding': '10px', 'minWidth': '100px'},
                    style_header={'backgroundColor': '#e74c3c', 'color': 'white', 'fontWeight': 'bold'},
                    style_data={'backgroundColor': '#ecf0f1'},
                    filter_action='native',
                    sort_action='native'
                )
            ], style={'padding': '20px'})
        ]),

        # Reprisals Tab
        dcc.Tab(label='Reprisal Operations', children=[
            html.Div([
                html.H2("Reprisal Operations Map", style={'color': '#2c3e50'}),
                dcc.Graph(figure=create_reprisals_map(data.get('reprisals', pd.DataFrame()))),

                html.H3("Reprisal Operations Data", style={'marginTop': 30}),
                dash_table.DataTable(
                    data=data.get('reprisals', pd.DataFrame()).to_dict('records'),
                    columns=[{"name": i, "id": i} for i in data.get('reprisals', pd.DataFrame()).columns],
                    page_size=15,
                    style_table={'overflowX': 'auto'},
                    style_cell={'textAlign': 'left', 'padding': '10px'},
                    style_header={'backgroundColor': '#2ecc71', 'color': 'white', 'fontWeight': 'bold'},
                    style_data={'backgroundColor': '#ecf0f1'},
                    filter_action='native',
                    sort_action='native'
                )
            ], style={'padding': '20px'})
        ]),

        # Units Tab
        dcc.Tab(label='Elite Units', children=[
            html.Div([
                html.H2("Elite Units Longevity", style={'color': '#2c3e50'}),
                dcc.Graph(figure=create_units_longevity_chart(data.get('units_longevity', pd.DataFrame()))),

                html.H3("Units Data", style={'marginTop': 30}),
                dash_table.DataTable(
                    data=data.get('units_longevity', pd.DataFrame()).to_dict('records'),
                    columns=[{"name": i, "id": i} for i in data.get('units_longevity', pd.DataFrame()).columns],
                    page_size=15,
                    style_table={'overflowX': 'auto'},
                    style_cell={'textAlign': 'left', 'padding': '10px'},
                    style_header={'backgroundColor': '#f39c12', 'color': 'white', 'fontWeight': 'bold'},
                    style_data={'backgroundColor': '#ecf0f1'},
                    filter_action='native',
                    sort_action='native'
                ),

                html.H3("Pre-State Units", style={'marginTop': 30}),
                dash_table.DataTable(
                    data=data.get('prestate_units', pd.DataFrame()).to_dict('records'),
                    columns=[{"name": i, "id": i} for i in data.get('prestate_units', pd.DataFrame()).columns],
                    page_size=10,
                    style_table={'overflowX': 'auto'},
                    style_cell={'textAlign': 'left', 'padding': '10px'},
                    style_header={'backgroundColor': '#9b59b6', 'color': 'white', 'fontWeight': 'bold'},
                    style_data={'backgroundColor': '#ecf0f1'},
                    filter_action='native',
                    sort_action='native'
                )
            ], style={'padding': '20px'})
        ]),

        # Special Operations Tab
        dcc.Tab(label='Special Operations', children=[
            html.Div([
                html.H2("Sayeret Matkal Operations", style={'color': '#2c3e50'}),
                dash_table.DataTable(
                    data=data.get('sayeret_matkal', pd.DataFrame()).to_dict('records'),
                    columns=[{"name": i, "id": i} for i in data.get('sayeret_matkal', pd.DataFrame()).columns],
                    page_size=10,
                    style_table={'overflowX': 'auto'},
                    style_cell={'textAlign': 'left', 'padding': '10px'},
                    style_header={'backgroundColor': '#34495e', 'color': 'white', 'fontWeight': 'bold'},
                    style_data={'backgroundColor': '#ecf0f1'}
                ),

                html.H2("Palyam Operations (1939-1948)", style={'marginTop': 30, 'color': '#2c3e50'}),
                dash_table.DataTable(
                    data=data.get('palyam_ops', pd.DataFrame()).to_dict('records'),
                    columns=[{"name": i, "id": i} for i in data.get('palyam_ops', pd.DataFrame()).columns],
                    page_size=10,
                    style_table={'overflowX': 'auto'},
                    style_cell={'textAlign': 'left', 'padding': '10px'},
                    style_header={'backgroundColor': '#16a085', 'color': 'white', 'fontWeight': 'bold'},
                    style_data={'backgroundColor': '#ecf0f1'}
                ),

                html.H2("Regional Defensive Units", style={'marginTop': 30, 'color': '#2c3e50'}),
                dash_table.DataTable(
                    data=data.get('regional_defensive', pd.DataFrame()).to_dict('records'),
                    columns=[{"name": i, "id": i} for i in data.get('regional_defensive', pd.DataFrame()).columns],
                    page_size=10,
                    style_table={'overflowX': 'auto'},
                    style_cell={'textAlign': 'left', 'padding': '10px'},
                    style_header={'backgroundColor': '#c0392b', 'color': 'white', 'fontWeight': 'bold'},
                    style_data={'backgroundColor': '#ecf0f1'}
                )
            ], style={'padding': '20px'})
        ])
    ])
], style={'fontFamily': 'Arial, sans-serif', 'maxWidth': '1400px', 'margin': '0 auto', 'padding': '20px'})

# Add custom CSS
app.index_string = '''
<!DOCTYPE html>
<html>
    <head>
        {%metas%}
        <title>{%title%}</title>
        {%favicon%}
        {%css%}
        <style>
            .metric-box {
                background-color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                text-align: center;
                min-width: 200px;
            }
        </style>
    </head>
    <body>
        {%app_entry%}
        <footer>
            {%config%}
            {%scripts%}
            {%renderer%}
        </footer>
    </body>
</html>
'''

if __name__ == '__main__':
    print("Starting SOFS Appendix Dashboard...")
    print("Open your browser and navigate to: http://127.0.0.1:8050")
    app.run_server(debug=True, host='0.0.0.0', port=8050)
