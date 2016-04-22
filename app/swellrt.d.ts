interface SwellRT {
  on(event: string, callback: Function);
  domain(): string;

  startSession(url: string, name: string, password: string, onSuccess: Function, onError: Function);
  stopSession();

  resumeSession(onSuccess: Function, onError: Function);

  openModel(id: string, onLoad: Function);
  closeModel(id: string);

  editor(parentElementId: string);


  events: any;
}

declare let SwellRT: SwellRT;
