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
  atualChartData: any;
  atualChartLabel: any;

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
    // this.getChart();
    this.form.tipo = '';
  }

  getChart() {
    this.userData.getChart().then((chart) => {
      switch (this.form.tipo) {
        case 'leituras':
          this.atualChartData = chart.body[0].leituras;
          this.lineChartLabels = chart.body[0].label.data[0];
          break;
        case 'concePo':
          this.atualChartData = chart.body[0].concePo;
          this.lineChartLabels = chart.body[0].label.data[0];
          break;
        case 'conceGas':
          this.atualChartData = chart.body[0].conceGas;
          this.lineChartLabels = chart.body[0].label.data[0];
          break;
        case 'conceOxi':
          this.atualChartData = chart.body[0].conceOxi;
          this.lineChartLabels = chart.body[0].label.data[0];
          break;
        case 'temperatura':
          this.atualChartData = chart.body[0].temperatura;
          this.lineChartLabels = chart.body[0].label.data[0];
          break;
        case 'umidade':
          this.atualChartData = chart.body[0].umidade;
          this.lineChartLabels = chart.body[0].label.data[0];
          break;
        case 'pressao':
          this.atualChartData = chart.body[0].pressao;
          this.lineChartLabels = chart.body[0].label.data[0];
          break;

        default:
          this.atualChartData = undefined;
          this.lineChartLabels = [];
          break;
      }
      if (this.atualChartData != undefined) {
        this.lineChartData = [
          {
            data: this.atualChartData.data[0],
            label: this.atualChartData.label
          }
        ];
      } else {
        this.lineChartData = [];
      }

    });

  }

}
