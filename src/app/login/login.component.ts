import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.less']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  constructor(private router: Router, private fb: FormBuilder, private message: NzMessageService, private loginService: LoginService) {}
  submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      return;
    }
    const params = this.validateForm.value;
    this.loginService.login(params).subscribe(data => {
      if (data.code === '00') {
        localStorage.setItem('userName', 'luohaha');
        this.router.navigate(['app/i']);
        // this.message.success('登陸成功');
      } else {
        this.message.error('用户名或密码错误');
      }
    });
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }
}
