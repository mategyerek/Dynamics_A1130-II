from dash import Dash, dcc, html, Input, Output, State, callback

app = Dash(__name__)

app.layout = html.Div([
    html.Button('up', id='up', n_clicks=0),
    html.Button('down', id='down', n_clicks=0),
    html.Button('left', id='left', n_clicks=0),
    html.Button('right', id='right', n_clicks=0),
    html.Div(id='output')
])


@callback(
    Output('output', 'children', allow_duplicate=True),
    Input('up', 'n_clicks'),
    prevent_initial_call=True,
)
def update_output(n_clicks):
    print('up')
    return ''


@callback(
    Output('output', 'children', allow_duplicate=True),
    Input('down', 'n_clicks'),
    prevent_initial_call=True,
)
def update_output(n_clicks):
    print('down')
    return ''


@callback(
    Output('output', 'children', allow_duplicate=True),
    Input('left', 'n_clicks'),
    prevent_initial_call=True,
)
def update_output(n_clicks):
    print('left')
    return ''


@callback(
    Output('output', 'children', allow_duplicate=True),
    Input('right', 'n_clicks'),
    prevent_initial_call=True,
)
def update_output(n_clicks):
    print('right')
    return ''


if __name__ == '__main__':
    app.run(debug=True)
