import React from 'react';
import ReactDOM from 'react-dom';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

const API_KEY = 'b5ed50537d3d4050544554c13fb7f722';

class Temperature {
    id = Math.random();
    @observable unit = 'C';
    @observable temperatureC = null;
    @observable location = '';
    @observable loading = true;
    @observable error = false;
    
    constructor(location) {
        this.location = location;
        this.fetch()
    }

    @computed get temperatureK() {
        console.log('calculating Kelvin');
        return this.temperatureC * (9/5) + 32;
    }

    @computed get temperatureF() {
        console.log('calculating Fahrenheit');
        return this.temperatureC + 273.15;
    }

    @computed get temperature() {
        switch (this.unit) {
            case 'C': return Math.round(this.temperatureC) + 'C';
            case 'K': return this.temperatureK + 'K';
            case 'F': return this.temperatureF + 'F';
        }
    }

    @action setUnit(newUnit) {
        this.unit = newUnit;
    }

    @action setC(degrees) {
        this.temperatureC = degrees;
    }

    @action setUnitAndTemperature(unit, degrees) {
        this.setUnit(unit);
        this.setC(degrees);
    }

    @action inc() {
        this.setC(this.temperatureC + 1);
    }

    @action fetch() {
        window.fetch(`http://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&q=${this.location}`)
        .then((res) => res.json())
        .then((json) => {
            this.temperatureC = json.main.temp - 273.5;
            this.loading = false;
        })
        .catch((err) => {
            this.loading = false;
            this.error = true;
        });
    }

    
}

const temps = observable([
    new Temperature('London'),
    new Temperature('Madrid'),
    new Temperature('Constanta'),
]);

const Temp = observer(({t}) => {
    return (
        <li onClick ={() => t.inc()}>
            {t.location}
            : {t.loading? 'Loading...' : t.error? 'Oops!Please enter city name again': t.temperature}
        </li>
    );
})

@observer class InputField extends React.Component {
    @observable input = '';
    render() {
        return (
            <div>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <input onChange={(e) => this.handleChange(e)} value={this.input} />
                    <input type="submit" />
                </form>
            </div>
        )
    }

    @action handleChange(e) {
        this.input = e.target.value;
    }
    
    @action handleSubmit(e) {
        e.preventDefault();
        this.props.temperatures.push(new Temperature(this.input));
    }
}

const App = observer(({temperatures}) => {
    return (
        <div>
            <InputField temperatures={temperatures}/>
            {temperatures.map(t => 
                <Temp key={t.id} t ={t}/>
            )}
            <DevTools/>
        </div>
    );
})

ReactDOM.render(<App temperatures={temps}/>, document.getElementById('root'));

window.t = temps;
window.Temperature = Temperature;