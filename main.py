from flask import *
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import requests,sqlite3,time,json,random,os
from bs4 import BeautifulSoup
import urllib.request, urllib.error, urllib.parse,webview
app = Flask(__name__)

Retorno_Pasta = "C:/Users/sustu/Pictures/Programmation/Python/Flask/Sloth/static/Banco.db"
webview.create_window('Sloth', app,resizable=True,width=1200,height=700 ,http_port=1005,js_api=True,minimized=True,on_top=True)

@app.route("/")
def Home():
    return render_template("index.html")

def chr_remove(old, to_remove):
    new_string = old
    for x in to_remove:
        new_string = new_string.replace(x,'')
    return new_string

@app.route("/Criar",methods=["GET","POST"])
def Criar():
    data = request.get_json()
    Dados = sqlite3.connect(Retorno_Pasta)
    Cursor = Dados.cursor()
    Cursor.execute(""" CREATE TABLE IF NOT EXISTS Sites (id INTEGER PRIMARY KEY AUTOINCREMENT,Url TEXT, Element TEXT , Conteudo BLOB, Evento TEXT) """)
    Cursor.execute(f""" INSERT INTO Sites values (NULL,"{data["url"]}","{data["Element"]}","{data["Conteudo"]}","{data["Evento"]}") """)
    Dados.commit()
    return "",201


@app.route("/Remove",methods=["GET","POST"])
def Remove():
    data = request.get_json()
    Dados = sqlite3.connect(Retorno_Pasta)
    Cursor = Dados.cursor()
    Cursor.execute(f""" DELETE FROM Sites WHERE id = {data["Id_Buscar"]} """)
    Dados.commit()
    return "",201


@app.route("/Editar",methods=["GET","POST"])
def Editar():
    data = request.get_json()
    Dados = sqlite3.connect(Retorno_Pasta)
    Cursor = Dados.cursor()
    Cursor.execute(f"""UPDATE Sites SET Url="{data["url"]}", Element="{data["Element"]}", Conteudo="{data["Conteudo"]}", Evento="{data["Evento"]}" WHERE id={data["id"]}  """)
    Dados.commit()
    return "",201

@app.route("/Fetch",methods=["GET","POST"])
def Fetch():
    try:
        db = sqlite3.connect(Retorno_Pasta)
        db.row_factory = sqlite3.Row
        cursor = db.cursor()
        cursor.execute("SELECT * FROM Sites ")
        dados = cursor.fetchall()
        return jsonify([dict(row) for row in dados])
    except sqlite3.Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()    

@app.route("/Access",methods=["GET","POST"])
def Acess():
    chromeOptions = webdriver.ChromeOptions()
    chromeOptions.add_experimental_option("excludeSwitches", ['enable-automation'])
    driver = webdriver.Chrome()
    Search = request.get_json()
    Banco = sqlite3.connect(Retorno_Pasta)
    cursor = Banco.cursor()
    cursor.execute(f"SELECT * FROM Sites WHERE id = {Search["Id_Buscar"]} ")
    dados = cursor.fetchall()
    for row in dados:
         driver.get(row[1])
         Element = str(row[2]).split(",")
         Conteudo = str(row[3]).split(",")
         for i in range(0,len(Element)):
            driver.find_element(By.XPATH,f'//*[@id="{chr_remove(str(Element[i]),"'[] ")}"]').send_keys(chr_remove(str(Conteudo[0]),"'[] "))
            driver.find_element("xpath",f"{row[4]}").click()
    time.sleep(100) 
    return "",201

@app.route("/Code_Download",methods=["GET","POST"])
def Code_Download():
    Search = request.get_json()
    Banco = sqlite3.connect(Retorno_Pasta)
    cursor = Banco.cursor()
    cursor.execute(f"SELECT * FROM Sites WHERE id = {Search["Id_Buscar"]} ")
    dados = cursor.fetchall()
    directory = str(time.time())
    Caminho_Completo = "C:/Users/sustu/Pictures/Programmation/Python/Flask/Sloth/Imagens/"
    path = os.path.join(Caminho_Completo, directory) 
    os.mkdir(path)
    for row in dados:
        url = row[1]
        response = requests.get(url)
        
    soup = BeautifulSoup(response.content, 'html.parser')
    links = soup.find_all('img')
        
    for link in links:
        try:
            img_data = requests.get(link.get('src')).content
            Gerar = random.randint(1,100000000000000000)
            with open(f"{Caminho_Completo}{directory}/{Gerar}.jpg","wb") as buscar:
                buscar.write(img_data)
        except:
            print("Nada")
    return "",201

@app.route("/CodeFont",methods=["GET","POST"])
def CodeFont():
    Search = request.get_json()
    Banco = sqlite3.connect(Retorno_Pasta)
    cursor = Banco.cursor()
    cursor.execute(f"SELECT * FROM Sites WHERE id = {Search["Id_Buscar"]} ")
    dados = cursor.fetchall()
    Gerar = random.randint(1,100000000000000000)
    for row in dados:
        url = row[1]
        try:
            response = urllib.request.urlopen(url)
            webContent = response.read().decode('UTF-8')
            with open(f'file{Gerar}.txt', 'w', encoding='utf-8') as f:
                f.write(webContent)
        except:
            print("Nada")
    return "",201


@app.route("/Search_Content",methods=["GET","POST"])
def Search_Content():
    Search = request.get_json()
    Banco = sqlite3.connect(Retorno_Pasta)
    cursor = Banco.cursor()
    cursor.execute(f"SELECT * FROM Sites WHERE id = {Search["Id_Buscar"]} ")
    dados = cursor.fetchall()
    Gerar = random.randint(1,100000000000000000)
    for row in dados:
        url = f"{row[1]}"
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        links = soup.find_all(f"{chr_remove(str(row[2]),"'[] ")}")
        with open(f'file{Gerar}.txt', 'w', encoding='utf-8') as f:
            for link in links:
                f.write("\n" + str(link.get(f"{chr_remove(str(row[3]),"'[] ")}")))
    return "",201
if __name__ == "__main__":
    # app.run(debug=True)
    webview.start(private_mode=False,http_server=True)