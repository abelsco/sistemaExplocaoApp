import { Silo } from './../../interfaces/user-options';
import { UserData } from './../../providers/user-data';
import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {
  public lineChartData: ChartDataSets[] = [
    { data: [], label: '' },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions) = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      // backgroundColor: 'rgba(255,0,0,0.3)',
      backgroundColor: 'rgba(232,173,78,.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  private atualSilo: Silo;
  form: {
    opcao: string,
    tipo: string,
  }
  atualChart: any;

  constructor(private userData: UserData) { }

  ngOnInit() {
    this.form = {
      opcao: 'Dia',
      tipo: '',
    }
    this.userData.getSilo().then(atual => {
      this.atualSilo = atual;
      this.userData.getRelatorio(this.atualSilo.codSilo, 'Dia');
      this.getChart()
    });
  }

  onChange() {
    this.userData.getRelatorio(this.atualSilo.codSilo, this.form.opcao);
  }

  getChart() {
    this.userData.getChart().then((chart) => {
      switch (this.form.tipo) {
        case 'concePo':
          this.atualChart = chart.body[0].concePo;
          break;
        case 'conceGas':
          this.atualChart = chart.body[0].conceGas;
          break;
        case 'conceOxi':
          this.atualChart = chart.body[0].conceOxi;
          break;
        case 'temperatura':
          this.atualChart = chart.body[0].temperatura;
          break;
        case 'umidade':
          this.atualChart = chart.body[0].umidade;
          break;
        case 'pressao':
          this.atualChart = chart.body[0].pressao;
          break;

        default:
          break;
      }
      if (this.atualChart != undefined) {


        console.log(this.atualChart);
        this.lineChartData = [
          { data: this.atualChart.data[0], label: this.atualChart.label }
        ];

        this.lineChartLabels = this.atualChart.data[1];
      }

    });

  }

}
