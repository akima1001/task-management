export class LoginUserCaseDTO {
  userName: string
  sessionId: string
  constructor(props: LoginUserCaseDTO) {
    this.userName = props.userName
    this.sessionId = props.sessionId
  }
}
