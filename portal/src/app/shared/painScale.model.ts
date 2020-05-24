import {PainForm} from './painForm.model'
import { RuminationForm } from './ruminationForm.model';
import { ControlForm } from './control.model';
export class PainScale {
    pcode:Number;
    name:String;
    emailId:String;
    painScale:Array<PainForm>;
    date:Date;
    ruminationScale:Array<RuminationForm>;
    controlScale:Array<ControlForm>;
    
}