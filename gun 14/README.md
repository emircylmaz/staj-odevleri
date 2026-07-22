Gun 13, "github personal access token kullanarak `microsoft` organizasyonunun repolarini
pagination kullanarak dolasarak cekme" modifiye edildi.

Calistirmak icin `npm run sync -- microsoft` komutunu proje konumunda calistirabilirsiniz.
`Microsoft` ornegimiz fakat farkli sirket isimleri de girilebilir.
Kodun calismasi icin `.env` dosyasi olusturulup icerisine personal access tokeninizi girmeniz gerekiyor,
dosyaniz `.env.example` icerisindeki kaliba uygun olmalidir.



Kodun ciktisinin sonundan ornek asagida, veriler gorulebiliyor:

.
.
.
Page 80 fetched (100 repos)
Page 81 fetched (100 repos)
Page 82 fetched (100 repos)
Page 83 fetched (15 repos)

API Fetch Summary:
- Total pages fetched: 83
- Total repositories fetched: 8215

🛠️ Ensuring database schema exists...
💾 Syncing repositories to database...
✅ Database sync complete!

================ DATABASE SUMMARY REPORT ================
📊 Total Repositories in DB: 8215

🌐 Language Breakdown:
   - Unknown/None: 1330
   - ABAP: 3
   - AL: 10
   - ANTLR: 1
   - ASL: 1
   - ASP.NET: 1
   - Assembly: 5
   - Astro: 3
   - Batchfile: 6
   - Bicep: 40
   - C: 186
   - C#: 1101
   - C++: 413
   - CMake: 1
   - COBOL: 1
   - CSS: 42
   - Circom: 1
   - Clojure: 1
   - CodeQL: 3
   - CoffeeScript: 2
   - Cool: 1
   - Cuda: 5
   - Cypher: 1
   - Cython: 1
   - Dafny: 1
   - Dart: 4
   - Dockerfile: 24
   - Elm: 1
   - F#: 13
   - F*: 1
   - GAP: 1
   - GLSL: 1
   - Gnuplot: 1
   - Go: 128
   - Go Template: 1
   - Groovy: 7
   - HCL: 29
   - HTML: 189
   - Handlebars: 1
   - Haskell: 1
   - JSON: 1
   - Java: 178
   - JavaScript: 405
   - Jinja: 2
   - Jsonnet: 1
   - Julia: 7
   - Jupyter Notebook: 398
   - Kotlin: 23
   - LLVM: 4
   - Lean: 1
   - Liquid: 1
   - Logos: 1
   - Lua: 3
   - M4: 1
   - MATLAB: 8
   - MDX: 4
   - MLIR: 1
   - Makefile: 2
   - Markdown: 1
   - Mathematica: 3
   - Matlab: 1
   - Mustache: 1
   - NSIS: 1
   - OCaml: 1
   - Objective-C: 13
   - Objective-C++: 2
   - Open Policy Agent: 1
   - PHP: 40
   - PLpgSQL: 1
   - Pawn: 1
   - Perl: 4
   - PostScript: 1
   - PowerShell: 384
   - Pug: 1
   - Python: 1652
   - Q#: 5
   - R: 32
   - Rich Text Format: 4
   - Roff: 1
   - Ruby: 60
   - Rust: 122
   - SCSS: 12
   - SWIG: 1
   - Sage: 2
   - Scala: 15
   - ShaderLab: 5
   - Shell: 124
   - Slash: 1
   - Smarty: 4
   - Solidity: 1
   - Swift: 28
   - SystemVerilog: 5
   - TLA: 1
   - TSQL: 29
   - Tcl: 1
   - TeX: 5
   - Thrift: 1
   - TypeScript: 1021
   - TypeSpec: 3
   - VBScript: 1
   - Verilog: 1
   - Vue: 9
   - WDL: 7
   - XQuery: 1
   - q: 1
   - wdl: 1

⭐ Top 5 Most Starred Repositories:
   1. vscode (187813 stars) -> https://github.com/microsoft/vscode
   2. markitdown (168047 stars) -> https://github.com/microsoft/markitdown
   3. PowerToys (136639 stars) -> https://github.com/microsoft/PowerToys
   4. generative-ai-for-beginners (113347 stars) -> https://github.com/microsoft/generative-ai-for-beginners
   5. TypeScript (109919 stars) -> https://github.com/microsoft/TypeScript
=========================================================

Mufredat pdf'inde "2. API'den gelen repoları kaydet; aynı komutu iki kez çalıştırınca duplike oluşmasın
(upsert ya da var-mı-kontrolü) — iki kez çalıştırıp kanıtla" belirtilmisti.

Kod tekrar calistirildiginda DB icerisindeki toplam repo sayisi ikiye katlanip `16430` olmak yerine `8215` kaliyor.
Cunku halihazirda olan databasein uzerine tekrar yaziyor. Bunu yaparken de repository id'sini kontrol ediyor.
Yani `microsoft`u iki kere calistirdigimizda ayni id'ye sahip oldugu icin uzerine yazdi,
ama ornek olarak ikinci turda `google` girseydik `microsoft`a dokunmadan uzerine `google`i yazacakti.