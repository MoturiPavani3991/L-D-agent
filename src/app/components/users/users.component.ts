import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, HostListener, ViewEncapsulation } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { HttpClient } from '@angular/common/http';
import {Router,ActivatedRoute  } from '@angular/router';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {
  @Input() public buttonText = '↩︎';
  @Input() public focus = new EventEmitter();
  @Output() public send = new EventEmitter();
  @Output() public dismiss = new EventEmitter();
  @ViewChild('message') message: ElementRef;
  @ViewChild('scrollMe') scrollMe: ElementRef;
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    event.returnValue = false;
  }

  scrollToBottom(): void {
    var container = document.getElementById("chat_window");
setTimeout(() => {
  container.scrollTop = container.scrollHeight;
}, 10);    
  }
  constructor(public service: WebSocketService, public http: HttpClient,public router:Router) { 
  }
  
  list = [{
    'name': 'Samuel Jackson',
    'address':"",
    'id':'2',
    'pic': 'https://ptetutorials.com/images/user-profile.png',
    'message': [{
      'from': "from",
      'text': "Hello",
      'type': 'USER',
      'date': Date.now()
    },{
      'from': "from",
      'text': "Hello",
      'type': 'Agent',
      'date': Date.now()
    },{
      'from': "from",
      'text': "I am facing an issue with registration",
      'type': 'USER',
      'date': Date.now()
    },{
      'from': "from",
      'text': "Let me know the issue in detail",
      'type': 'Agent',
      'date': Date.now()
    },{
      'from': "from",
      'text': "While i am registering it wouldn't accept the details",
      'type': 'USER',
      'date': Date.now()
    },{
      'from': "from",
      'text': "Ok will check and leet you know",
      'type': 'Agent',
      'date': Date.now()
    },{
      'from': "from",
      'text': "Let me know the issue in detail",
      'type': 'Agent',
      'date': Date.now()
    },{
      'from': "from",
      'text': "While i am registering it wouldn't accept the details",
      'type': 'USER',
      'date': Date.now()
    },{
      'from': "from",
      'text': "Ok will check and leet you know",
      'type': 'Agent',
      'date': Date.now()
    },{
      'from': "from",
      'text': "Let me know the issue in detail",
      'type': 'Agent',
      'date': Date.now()
    },{
      'from': "from",
      'text': "While i am registering it wouldn't accept the details",
      'type': 'USER',
      'date': Date.now()
    },{
      'from': "from",
      'text': "Ok will check and leet you know",
      'type': 'Agent',
      'date': Date.now()
    }],
    'status': 'dummy',
    'end': true,
  },
  {
    'name': 'Amelia',
    'address':"",
    'id':'1',
    'pic': 'https://image.shutterstock.com/image-vector/avatar-businesswoman-portrait-circle-vector-260nw-572528593.jpg',
    'message': [{
      'from': "from",
      'text': "Hello",
      'type': 'USER',
      'date': Date.now()
    },{
      'from': "from",
      'text': "Hello",
      'type': 'Agent',
      'date': Date.now()
    },{
      'from': "from",
      'text': "I want to create new postpaid plan",
      'type': 'USER',
      'date': Date.now()
    },{
      'from': "from",
      'text': "Ok could you provide details about your plan",
      'type': 'Agent',
      'date': Date.now()
    },{
      'from': "from",
      'text': "Yeah sure",
      'type': 'USER',
      'date': Date.now()
    },
    {
      'from': "from",
      'text': "2GB data/day  data plan",
      'type': 'USER',
      'date': Date.now()
    },{
      'from': "from",
      'text': "Ok will send you the details about this plan shortly.",
      'type': 'Agent',
      'date': Date.now()
    }
    ],
    'status': 'dummy',
    'end': true,
  
  }];
  activeindex=0;
  searchitem;
  conversation = [];
  data;user
  isSelected=false;
  temp = false;
  name = ""
  email = ""
  phno = ""
  userpic = ""
  
  logout(){
    this.service.disconnect(sessionStorage.getItem('name'))
    sessionStorage.clear()
    this.router.navigateByUrl('/')
   
  }
  ngOnInit() {  
    this.service.connection(sessionStorage.getItem('name'));
    if(sessionStorage.getItem('name')==null)
    this.router.navigateByUrl('/')  
    this.user=sessionStorage.getItem('name').split('@')[0]
    localStorage.clear();
    console.log(this.service.socket.id);
    this.focus.subscribe(() => this.focusMessage());
    this.service.getMessages()
      .subscribe((data) => {
       console.log(data)
       const index = this.list.findIndex(x => x.id === data.user.id);
       if(index==-1){
         this.list.push(
          {
            'name': data.user.name,
            'id':data.user.id,
            'address':data.address,
            'pic': 'https://ptetutorials.com/images/user-profile.png',
            'message':[data.text],
            'status': 'Accepted',
            'end': true,
          });
        }
        else
        {
          this.addMessage({ from: 'agent', text:data.text, type: 'USER', date: new Date().getTime() }); 
        }
  })
}
  chatactive(v,i) {
    this.conversation=[]
    this.list[i].message.forEach(element => {
      this.addMessage({ from: element.from, text:element.text, type: element.type, date: new Date().getTime() });
    });
    console.log(this.list)    
    this.activeindex=i
    sessionStorage.setItem('userid',v)

    console.log(v,i,this.service.socket.id)
    console.log("*****************", this.list[i].message)
    this.name = this.list[i].name
    this.userpic = this.list[i].pic
    this.addMessage({ from: 'agent', text:this.list[i].message, type: 'USER', date: new Date().getTime() });
    this.http.post("https://ab3f8fa4.ngrok.io/getdata",{"msg":"You have been connected with Antony.","address":this.list[i].address}).subscribe(res=>{
      console.log(res)
    })
    console.log("*****************", this.conversation)    
    this.scrollToBottom();


}
  end() {
    console.log("end",sessionStorage.getItem('id'))
    this.http.post("https://ab3f8fa4.ngrok.io/end",{"id":sessionStorage.getItem('userid'),"add":this.list[2].address}).subscribe(res=>{
      console.log(res)
    })
  }
  onSubmit() {
    
    // const i = this.list.findIndex(x => x.id === localStorage.getItem('id')); 
    // console.log(i) 
    const message =this.getMessage();
    console.log(message);
    if (message.trim() === '') {
      return;
    }
    console.log(this.list)
    const index = this.list.findIndex(x => x.id === sessionStorage.getItem('userid'));
    this.addMessage({ from: 'agent', text: this.getMessage(), type: 'Agent', date: new Date().getTime() });
    this.service.sendMessage(this.getMessage(),this.list[2].address)
    this.http.post("https://ab3f8fa4.ngrok.io/getdata",{"msg":this.getMessage(),"address":this.list[2].address}).subscribe(res=>{
      console.log(res)
    })
    this.clearMessage();
    this.focusMessage();
  
}
  public addMessage({ from, text, type, date }: { from; text; type; date; }) {
    console.log(text)
    if(text!='')
    this.conversation.push({
      'from': from,
      'text': text,
      'type': type,
      'date': date,
    });
    console.log(this.conversation)
    this.scrollToBottom();
  }


  public focusMessage() {
    this.message.nativeElement.focus();
  }

  public getMessage() {
    return this.message.nativeElement.value;
  }

  public clearMessage() {
    this.message.nativeElement.value = '';
  }
}
