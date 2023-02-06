export class SignupDTO {
  userId: string
  userName: string
  emailAddress: string
  telephoneNumber: string
  sessionId: string
  constructor(props: SignupDTO) {
    this.userId = props.userId
    this.userName = props.userName
    this.emailAddress = props.emailAddress
    this.telephoneNumber = props.telephoneNumber
    this.sessionId = props.sessionId
  }
}
