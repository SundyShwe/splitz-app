import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment as env } from 'src/environments/environment.development';
import { Group, GroupInfo } from '../interfaces/group';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private http = inject(HttpClient);

  //get group list
  getAllGroups() {
    return this.http.get<{ success: boolean; data: any }>(
      env.SERVER_URL + 'groups'
    );
  }

  //create new group
  createGroup(data: GroupInfo) {
    return this.http.post<{ success: boolean; data: any }>(
      env.SERVER_URL + 'groups/',
      data
    );
  }

  //get Group Info
  getGroupInfo(group_id: string) {
    return this.http.get<{ success: boolean; data: Group }>(
      env.SERVER_URL + 'groups/' + group_id
    );
  }

  //update new group
  updateGroup(data: { group_id: string; group: GroupInfo }) {
    return this.http.post<{ success: boolean; data: any }>(
      env.SERVER_URL + 'groups/' + data.group_id,
      data.group
    );
  }

  //add members to group
  addMemberToGroup(data: {
    group_id: string;
    fullname: string;
    email: string;
  }) {
    return this.http.post<{ success: boolean; data: any }>(
      env.SERVER_URL + 'groups/' + data.group_id + '/members',
      data
    );
  }

  //delete members from group
  removeMember(data: { group_id: string; member_id: string }) {
    return this.http.delete<{ success: boolean; data: any }>(
      env.SERVER_URL + 'groups/' + data.group_id + '/members/' + data.member_id
    );
  }

  constructor() {}
}
