ZoomMtg.setZoomJSLib('https://source.zoom.us/2.13.0/lib', '/av')
// loads WebAssembly assets
ZoomMtg.preLoadWasm()
ZoomMtg.prepareWebSDK()
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US')
ZoomMtg.i18n.reload('en-US')

const apiKey = 'YOUR_API_KEY';
const meetingConfig = {
  apiKey: apiKey,
  meetingNumber: 'YOUR_MEETING_NUMBER',
  userName: 'YOUR_NAME',
  userEmail: 'YOUR_EMAIL',
  passWord: 'MEETING_PASSWORD',
  role: 0 // 0 for host, 1 for attendee
};

ZoomMtg.init({
  leaveUrl: 'YOUR_LEAVE_URL',
  isSupportAV: true,
  success: function () {
    ZoomMtg.join({
      ...meetingConfig,
      success: function () {
        console.log('Meeting join success');
      },
      error: function (error) {
        console.error('Meeting join error:', error);
      }
    });
  },
  error: function (error) {
    console.error('Zoom SDK error:', error);
  }
});