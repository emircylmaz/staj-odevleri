1. Her gelistiricinin toplam commit sayisi (azalan sirada)

SELECT d.name, COUNT(c.id) 
    AS total_commits 
FROM developers d 
LEFT JOIN commits c 
    ON d. id = c.developer_id 
GROUP BY d.id, d.name 
ORDER BY total_commits DESC;

2. Son 30 gunde acilmis ama henuz merge edilmemis MR'lar

SELECT * 
FROM merge_requests 
WHERE status = 'open' 
    AND created_at >= datetime('now','-30 days');

3. En çok commit yapan ilk 5 gelistirici

SELECT developers.name, COUNT(commits.id) 
    AS commit_count 
FROM developers 
LEFT JOIN commits 
    ON developers.id=commits.developer_id 
GROUP BY developers.id, developers.name 
ORDER BY commit_count DESC 
LIMIT 5;

4. Her takim için MR sayisi (JOIN + GROUP BY)

SELECT developers.team 
    AS team_name, COUNT(merge_requests.id) 
    AS total_mrs 
FROM developers 
INNER JOIN merge_requests 
    ON developers.id = merge_requests.developer_id 
    GROUP BY developers.team;

5. Hic commit'i olmayan gelistiriciler (LEFT JOIN ile — neden INNER JOIN ile bulunamayacagini
yorumda acikla)

SELECT developers.id, developers.name 
FROM developers 
LEFT JOIN commits 
    ON developers.id = commits.developer_id 
WHERE commits.id IS NULL;

INNER JOIN sadece eslesme varsa veriyi gosterir. Aradigimiz gelistiriciler hic commit yapmadigi icin
LEFT JOIN degil de INNER JOIN kullanmis olsaydik aradigimiz gelistiriciler listede gorunmezdi.

6. Merge edilmis MR'larin ortalama kapatilma/merge suresi (Saat cinsinden)
SELECT 
    ROUND(AVG((julianday(merged_at) - julianday(created_at)) * 24), 2) AS avg_merge_time_hours
FROM merge_requests 
WHERE status = 'merged' AND merged_at IS NOT NULL;

7. Aylik MR sayilari ve kirilimi
SELECT 
    strftime('%Y-%m', created_at) AS month,
    COUNT(id) AS total_mrs,
    SUM(CASE WHEN status = 'merged' THEN 1 ELSE 0 END) AS merged_mrs
FROM merge_requests
GROUP BY month
ORDER BY month DESC;