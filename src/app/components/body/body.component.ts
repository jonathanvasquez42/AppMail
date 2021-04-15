import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { timeInterval, timestamp } from 'rxjs/operators';
import { MailModel } from 'src/app/models/mail.model';
import { MailService } from 'src/app/services/mail.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html'
})

export class BodyComponent implements OnInit{
  cargando = false;
  mails: any[] = [];
  listadoEmail: any[] = [];
  temporalEmail: any[] = [];

  //carga archivo
  arrayBuffer:any;
  file:File;

  constructor(private mailService: MailService){
    
  }

  ngOnInit(){

  }

  incomingfile(event) 
  {
    this.file= event.target.files[0]; 
  }

  buscar(form: NgForm){
    
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        var view = new Array();

        for(var i = 0; i != data.length; ++i){
          arr[i] = String.fromCharCode(data[i]);
        }

        
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, {type:"binary"});
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];

          for(var j = 1; j <= workbook['Strings'].length; j++){
            var desired_cell = worksheet["A"+j];
            var desired_value = (desired_cell ? desired_cell.v : undefined);
            if (desired_value != undefined ){
              this.listadoEmail.push(desired_cell.v);
            }
          }
      
          this.ObtenerVulnerabilidades(this.listadoEmail,form.value.api_key);
      }
      
    fileReader.readAsArrayBuffer(this.file);
    //this.cargando = false;
    //this.mails = this.listadoEmail;
  }

private ObtenerVulnerabilidades(listadoObj: any[], api :string){
  var indice = 0, interval;

    interval = setInterval(() => {
      this.mailService.getEmailVulnerados(api,listadoObj[indice]).subscribe((data: any) =>{ 
        //this.temporalEmail = data;
        this.mails = data;
      }, (error)=>{
        console.log(error.error);
      });
      indice += 1;
      if (indice >= listadoObj.length) {
        clearInterval(interval);
      }
    }, 2000);
  }

}