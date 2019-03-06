import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Storage } from '@ionic/storage';

/** 
 Logic
 1. If credit limit is available, show dashboard with credit stats
 2. If existing VPA is available, show VPA list along with new VPA creation.
 3. If no VPA, must create new VPA.
 4. once VPA is selected, request for credit.
 5. once credit is approved from bank, approve it from user end.
 **/
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: any;
  vpas: Array<any> = [];
  credit: any = undefined;
  showNewUPI: boolean = true;
  vpa: string;
  loading: Loading;

  constructor(public navCtrl: NavController, private auth: AuthServiceProvider, private storage: Storage,
    private loadingCtrl: LoadingController, private alertCtrl: AlertController) {

  }

  getCreditDetails() {
    return this.storage.get('user').then((user) => {
      this.user = user;
      return this.auth.getCreditUpi(user.username).subscribe(result => {
        if (undefined != result.success && !result.success) {
          return this.auth.getUpiList(user.username).subscribe(result => {
            this.vpas = result
          })
        } else {
          this.credit = result;
        }
        console.log(result);
      })
    })
  }

  createVpa() {
    this.showLoading();
    return this.auth.validateUpi(this.vpa).subscribe(result => {
      this.loading.dismiss()
      if (undefined != result.success && !result.success) {
        let object = {
          "mobile": "9887800479",
          "device-id": "8452165486XXXX",
          "seq-no": " ef1e92b4a01d4618a0eca5fdecc37ff23f3",
          "channel-code": "ImoXXXX",
          "virtual-address": this.vpa,
          "author": this.user.username
        }
        return this.auth.createUpi(object).subscribe(result => {
          if (undefined != result.success && !result.success) {
            this.showError(result.message)
          } else {
            this.toggleInput()
            this.vpa = "";
            this.getCreditDetails()
          }
        })
      } else {
        this.showError("VPA already exist")
      }
    })
  }

  requestCredit() {
    console.log("IN")
    this.showLoading();
    let credit = {
      "mobile": this.randomFixedInteger(10),
      "author": this.user.username,
      "status": "P"
    }
    return this.auth.requestCredit(credit).subscribe(result => {
      this.loading.dismiss()
      this.getCreditDetails()
    })

  }

  ionViewDidLoad() {
    this.getCreditDetails()
  }

  showLoading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
        dismissOnPageChange: true
      });
      this.loading.present();      
    }
  }

  showError(text) {
 
    let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(alert);
  }

  showAlert(text) {
 
    let alert = this.alertCtrl.create({
      title: 'Alert!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(alert);
  }

  toggleInput() {
    console.log(this.showNewUPI)
    this.showNewUPI = !this.showNewUPI
  }
  
  randomFixedInteger(length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
  }

  approve() {
    let credit = {
      "status": "A"
    }
    return this.auth.updateCreditUpi(this.credit.id, credit).subscribe(result => {
      if (undefined != result.success && !result.success) {
        this.showError(result.message)
      } else {
        this.getCreditDetails()
      }
    })
  }

  reject() {
    this.showAlert("The feature is not implemented yet")
  }
}
