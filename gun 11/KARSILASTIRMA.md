1. Her gelistiricinin toplam commit sayisi (azalan sirada)

SELECT d.name, COUNT(c.id) 
    AS total_commits 
FROM developers d 
LEFT JOIN commits c 
    ON d. id = c.developer_id 
GROUP BY d.id, d.name 
ORDER BY total_commits DESC;



const query1 = await db
    .select({
      name: schema.developers.name,
      total_commits: sql<number>`cast(count(${schema.commits.id}) as integer)`,
    })
    .from(schema.developers)
    .leftJoin(schema.commits, eq(schema.developers.id, schema.commits.developer_id))
    .groupBy(schema.developers.id, schema.developers.name)
    .orderBy((aliases) => desc(aliases.total_commits));



2. Son 30 gunde acilmis ama henuz merge edilmemis MR'lar

SELECT * 
FROM merge_requests 
WHERE status = 'open' 
    AND created_at >= datetime('now','-30 days');



const query2 = await db
    .select()
    .from(schema.merge_requests)
    .where(
      and(
        eq(schema.merge_requests.status, "open"),
        gte(schema.merge_requests.created_at, sql`datetime('now', '-30 days')`)
      )
    );



3. En çok commit yapan ilk 5 gelistirici

SELECT developers.name, COUNT(commits.id) 
    AS commit_count 
FROM developers 
LEFT JOIN commits 
    ON developers.id=commits.developer_id 
GROUP BY developers.id, developers.name 
ORDER BY commit_count DESC 
LIMIT 5;



const query3 = await db
    .select({
      name: schema.developers.name,
      commit_count: sql<number>`cast(count(${schema.commits.id}) as integer)`,
    })
    .from(schema.developers)
    .leftJoin(schema.commits, eq(schema.developers.id, schema.commits.developer_id))
    .groupBy(schema.developers.id, schema.developers.name)
    .orderBy((aliases) => desc(aliases.commit_count))
    .limit(5);



4. Her takim için MR sayisi (JOIN + GROUP BY)

SELECT developers.team 
    AS team_name, COUNT(merge_requests.id) 
    AS total_mrs 
FROM developers 
INNER JOIN merge_requests 
    ON developers.id = merge_requests.developer_id 
    GROUP BY developers.team;



const query4 = await db
    .select({
      team_name: schema.developers.team,
      total_mrs: sql<number>`cast(count(${schema.merge_requests.id}) as integer)`,
    })
    .from(schema.developers)
    .innerJoin(schema.merge_requests, eq(schema.developers.id, schema.merge_requests.developer_id))
    .groupBy(schema.developers.team);



5. Hic commit'i olmayan gelistiriciler

SELECT developers.id, developers.name 
FROM developers 
LEFT JOIN commits 
    ON developers.id = commits.developer_id 
WHERE commits.id IS NULL;



const query5 = await db
    .select({
      id: schema.developers.id,
      name: schema.developers.name,
    })
    .from(schema.developers)
    .leftJoin(schema.commits, eq(schema.developers.id, schema.commits.developer_id))
    .where(isNull(schema.commits.id));



**Ham SQL Yolu:** `LEFT JOIN` kullanarak `commits` tablosunda eşleşmeyen (hiç commit yapmamış) geliştiricileri bulmak için `WHERE commits.id IS NULL` filtresi uygulanır. `INNER JOIN` kullanılsaydı eşleşmeyen geliştiriciler doğrudan eleneceği için bu veri elde edilemezdi.
**Drizzle ORM Yolu:** Drizzle'da `leftJoin` kullanıldığında, birleşen tablonun tüm alanları varsayılan olarak `T | null` (nullable) tipine bürünür.



Kendi Yorumum:

Sorguların iki türlü, ham SQL ve ORM kullanılarak, yazaılmış hallerini yan yana incelediğimde
ham SQL'in kendi açımdan daha okunabilir, daha net anlaşılabilir olduğunu düşünüyorum. Ama aynı
zamanda ORM kullanılarak yazılmış olan kodun büyük projelerde veya farklı insanlarla çalışırken
daha kolay kullanılabilir, daha kolay okunabilir veya aranan kodun daha kolay bulunabilir 
olabileceğini de düşünüyorum.