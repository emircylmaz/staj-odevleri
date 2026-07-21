Yorumlari sirali ve paralel olarak 5 kere calistirdim ve her birinin
sonucunu asagiya koydum:

---STEP 3: Performance Benchmark
Sequential execution time: 547.46 ms
Parallel execution time (Promise.all): 193.06 ms


---STEP 3: Performance Benchmark
Sequential execution time: 534.60 ms
Parallel execution time (Promise.all): 171.84 ms


---STEP 3: Performance Benchmark
Sequential execution time: 633.49 ms
Parallel execution time (Promise.all): 174.15 ms


---STEP 3: Performance Benchmark
Sequential execution time: 601.32 ms
Parallel execution time (Promise.all): 178.17 ms


---STEP 3: Performance Benchmark
Sequential execution time: 596.34 ms
Parallel execution time (Promise.all): 186.44 ms

Gorulebilecegi uzere paralel olarak calismasi sirali olarak calismasina kiyasla ortalama olarak 3 kat daha hızlı.
`Promise.all` birden fazla isle ugrasirken isi epey optimize hale getiriyor.