import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IBills, IOwed_By, IPaid_By } from 'src/app/types/interfaces';
import { environment as env } from 'src/environment/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  private http = inject(HttpClient);

  getAllBills(group_id: string) {
    // console.log(env.SERVER_URL + 'groups/' + group_id + '/bills');
    return this.http.get<{ success: boolean; data: any }>(
      env.SERVER_URL + 'groups/' + group_id + '/bills'
    );
  }

  addBill(data: { gid: string; formData: FormData }) {
    // console.log(env.SERVER_URL + 'groups/' + data.gid + '/bills');
    return this.http.post<{ success: boolean; data: any }>(
      env.SERVER_URL + 'groups/' + data.gid + '/bills',
      data.formData
    );
  }

  //@route    POST /groups/:group_id/bills/:bill_id/paidowed
  addPaidOwed(data: {
    gid: string;
    bid: string;
    paidowed: {
      paid_by: IPaid_By[];
      owed_by: IOwed_By[];
    };
  }) {
    return this.http.post<{ success: boolean; data: any }>(
      env.SERVER_URL +
        'groups/' +
        data.gid +
        '/bills/' +
        data.bid +
        '/paidowed',
      data.paidowed
    );
  }

  //get Bill Info
  //@route    GET /groups/:group_id/bills/:bill_id
  getBillInfo(group_id: string, bill_id: string) {
    return this.http.get<{ success: boolean; data: IBills }>(
      env.SERVER_URL + 'groups/' + group_id + '/bills/' + bill_id
    );
  }

  //@route    POST /groups/:group_id/bills/:bill_id
  updateBill(data: { gid: string; bid: string; formData: FormData }) {
    return this.http.post<{ success: boolean; data: any }>(
      env.SERVER_URL + 'groups/' + data.gid + '/bills/' + data.bid,
      data.formData
    );
  }

  //@route    delete /groups/:group_id/bills/:bill_id
  deleteBill(data: { gid: string; bid: string }) {
    return this.http.delete<{ success: boolean; data: any }>(
      env.SERVER_URL + 'groups/' + data.gid + '/bills/' + data.bid
    );
  }
  updatePaidOwed(data: {
    gid: string;
    bid: string;
    paidowed: {
      paid_by: IPaid_By[];
      owed_by: IOwed_By[];
    };
  }) {
    return this.http.post<{ success: boolean; data: any }>(
      env.SERVER_URL +
        'groups/' +
        data.gid +
        '/bills/' +
        data.bid +
        '/updatepaidowed',
      data.paidowed
    );
  }
  constructor() {}
}
