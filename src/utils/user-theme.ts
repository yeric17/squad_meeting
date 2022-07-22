const avatars = [
    "https://wxprjppcnqqmfyylqmfr.supabase.co/storage/v1/object/sign/avatars/bad-milk.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2JhZC1taWxrLmpwZyIsImlhdCI6MTY1ODQ5Mjg0OSwiZXhwIjoxOTczODUyODQ5fQ.LDxHd8rouQ9X4gBPhJ0zARs8IdwrsrwpayV680TOSdo&t=2022-07-22T12%3A27%3A29.169Z",
    "https://wxprjppcnqqmfyylqmfr.supabase.co/storage/v1/object/sign/avatars/bucks-dog.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2J1Y2tzLWRvZy5qcGciLCJpYXQiOjE2NTg0OTI4NzYsImV4cCI6MTk3Mzg1Mjg3Nn0.7-iniHKpUIv5-q3CIMFzebRRzGJftDzA5Dl8sLNj4Zg&t=2022-07-22T12%3A27%3A56.733Z",
    "https://wxprjppcnqqmfyylqmfr.supabase.co/storage/v1/object/sign/avatars/child-in-space.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2NoaWxkLWluLXNwYWNlLmpwZyIsImlhdCI6MTY1ODQ5Mjg4OSwiZXhwIjoxOTczODUyODg5fQ.CRD4qiaAuliTuVC6Bk5x6VyAIasxOh4KYYBUvJG05Sk&t=2022-07-22T12%3A28%3A08.956Z",
    "https://wxprjppcnqqmfyylqmfr.supabase.co/storage/v1/object/sign/avatars/cocktail.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2NvY2t0YWlsLmpwZyIsImlhdCI6MTY1ODQ5MjkwMCwiZXhwIjoxOTczODUyOTAwfQ.UM4vewCFG5rC6M6cx_41aROEAFyPB_mraId7cm6T3fw&t=2022-07-22T12%3A28%3A19.855Z",
    "https://wxprjppcnqqmfyylqmfr.supabase.co/storage/v1/object/sign/avatars/flame.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2ZsYW1lLmpwZyIsImlhdCI6MTY1ODQ5MzA0MiwiZXhwIjoxOTczODUzMDQyfQ.T0BCaf6OgtshU0efwC78Tl0rCFy0QdBFOe_USX13fvw&t=2022-07-22T12%3A30%3A42.622Z",
    "https://wxprjppcnqqmfyylqmfr.supabase.co/storage/v1/object/sign/avatars/flight-commander.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2ZsaWdodC1jb21tYW5kZXIuanBnIiwiaWF0IjoxNjU4NDkzMDU4LCJleHAiOjE5NzM4NTMwNTh9.1U4W7Gzjqc1NhE6L_21hjHY9Jrdt2AXTv2ufpouYR9E&t=2022-07-22T12%3A30%3A58.809Z",
    "https://wxprjppcnqqmfyylqmfr.supabase.co/storage/v1/object/sign/avatars/sun-and-moon.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL3N1bi1hbmQtbW9vbi5qcGciLCJpYXQiOjE2NTg0OTMwNzIsImV4cCI6MTk3Mzg1MzA3Mn0.11qbfMenL2KbznQYJusDsqM-K214gooMj9piphr2JZM&t=2022-07-22T12%3A31%3A12.161Z"
]


export const getRandomAvatar = () =>{
    return avatars[Math.floor(Math.random() * avatars.length)]
}