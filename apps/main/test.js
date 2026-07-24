const url = 'https://zrgnoeyfnfhatqkkhskf.supabase.co/storage/v1/object/public/vavaw-media/media/main/images/1784868599392-jq5xbw.jpg';
fetch(url).then(res => {
  console.log('Status:', res.status);
  console.log('Headers:', res.headers.get('content-type'));
}).catch(console.error);
