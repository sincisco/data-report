import {ContainerImmutable} from '@core/node/container/container.immutable.interface';
// import {FaceEchart} from '@core/node/face/echart.face';
import {Face} from '@core/node/face/face';

const CONTAINER_SIMPLE_TEMPLATE = `
<div class="chart-container">
    <div class="chart-settings-mask"></div>
    <div class="chart-settings-panel">
        <div class="face face-simple" data-attr="one" data-key="1"></div>
    </div>
    <div class="simple">
        <figure>
        </figure>
    </div>
</div>
`;

export class SimpleContainer extends ContainerImmutable {
    private _$simple: JQuery;
    private _$figure: JQuery;

    constructor() {
        super(CONTAINER_SIMPLE_TEMPLATE);
        this._$simple = this._$element.find('.simple');
        this._$figure = this._$simple.find('figure');

        this._init();
    }


    private _face: Face;

    public setChart(options: any, index: number) {
        if (!this._face) {
            // this._face = new FaceEchart(this._$figure[0], options);
            this._$figure.removeClass('no-chart');
        }
        this._face.select();
    }

    set start(param1){

    }


    private _init() {

    }

    render() {
        return `
        <div class="simple-container">${this._face ? this._face.render() : ''}</div>
        `;
    }

    public resize() {
        this._face && this._face.resize();
    }

    public destroy() {
        this._face && this._face.destroy();
    }

    private _data = [
        {
            'name': '图表1', 'value': '', 'group': '图表', index: 1, 'editor': {
                'type': 'combobox',
                'options': {
                    'data': [
                        {
                            'text': 'none',
                            'value': ''
                        }, {
                            'text': 'one',
                            'value': 'one'
                        }, {
                            'text': 'two',
                            'value': 'two'
                        }
                    ],
                    'valueField': 'value',
                    'textField': 'text',
                    'editable': false,
                    'panelHeight': 120,
                    'required': true
                }

            }
        },
        {
            'name': '图表2', 'value': '', 'group': '图表', index: 2, 'editor': {
                'type': 'combobox',
                'options': {
                    'data': [
                        {
                            'text': 'none',
                            'value': ''
                        }, {
                            'text': 'one',
                            'value': 'one'
                        }, {
                            'text': 'two',
                            'value': 'two'
                        }
                    ],
                    'valueField': 'value',
                    'textField': 'text',
                    'editable': false,
                    'panelHeight': 120,
                    'required': true
                }

            }
        }
    ];

    public get data() {
        return this._data;
    }
}
