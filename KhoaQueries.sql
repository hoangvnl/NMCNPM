--Lấy tất cả các bộ từ vựng của riêng mình (thay số 1 cuối là idtaikhoan)
select * from botv where idtaikhoantao = 1
--Lấy từ vựng theo bộ từ vựng (sửa số 1 cuói)
select * from dstuvung where idbotv = 1
--Lấy bộ từ vựng mình lưu về (thay số 1 cuối)
select * from botvluu l left join botv b on l.idbotv = b.idbotv where b.congkhai = 1 and l.idtaikhoan = 1

-- fulltext search
select * from botv where tenBoTV LIKE "%an%"
select * from botv where tenBoTV LIKE "%an uong%"

select * from botv where match(tenBoTV) AGAINST("van phong");