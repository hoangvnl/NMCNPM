trong route->user-router->QLTuVung.js sửa cái row1 lại botvModel.allByUserID(id)

Search:
 Lấy text = input()
	textSearch = "%" + text + "%"
 Sử dụng truy vấn:
 	Select * from botv where tenBoTV LIKE textSearch

VD: text = "an uong"
=> Truy vấn là: 
	Select * from botv where tenBoTV LIKE "%an uong%"