import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'
import { map } from 'rxjs/operators';

@Injectable()
export class MailService{
    mails: any[] = [];
    constructor(private http: HttpClient){
    }

    getEmailVulnerados(api: string, mail: string){
        const url = 'https://haveibeenpwned.com/api/v3/';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, X- Request-With',
            'hibp-api-key': api
        });

        return this.http.get(`${url}breachedaccount/${mail}`,{headers}).pipe(map(data => {
            console.log(data);
            for (let i in data){
                this.mails.push({
                  mailConsultado: mail,
                  mailResultado: data[i].Name
                });
            }
            return this.mails;
        }));
        
    }
}