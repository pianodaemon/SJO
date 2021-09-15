import os, json, requests
from datetime import datetime

from flask import Flask, url_for, render_template, request, jsonify, Blueprint

from general import URLFrp, menuGraphics

bp = Blueprint('graphics', __name__,
                        template_folder='templates')


@bp.route('/', methods=['GET', 'POST'])
@bp.route('/graphics', methods=['GET', 'POST'])
def graphicsList():

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':

        departments = requests.get( URLFrp + 'catalogues/departments' ).json()
        providers = requests.get( URLFrp + 'providers/?limit=10000000&order_by=title' ).json()
        periodos_admon = calcular_periodos_admon()

        return render_template( 'graphics/index.html',
                                catalog='graphics',
                                menu=menuGraphics,
                                departments=departments,
                                providers=providers,
                                urlLink='/projects_follow_ups',
                                periodos=periodos_admon)

    else:
        url = URLFrp + request.query_string.decode("utf-8")

        r = requests.get( url)
        dataRes = r.json()

        return jsonify( { 'data' : dataRes } )


@bp.route('/projects_follow_ups', methods=['GET', 'POST'])
def projectsFollowUps():

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':

        return render_template( 'graphics/list.html',
                                catalog        ='projects_follow_ups',
                                menu           = menuGraphics,
                                pagePrev       = '/graphics',
                                urlLink        = '/project_detail/'   )

    else:
        data = request.get_json()

        paginationStart = str(data['paginationStart'])
        departmentId    = str(data['department'])
        statusId        = str(data['status'])
        cityId          = str(data['city'])
        startDate       = str(data['startDate'])
        endDate         = str(data['endDate'])
        providerId      = str(data['provider'])
        fundingId       = str(data['funding'])
        programId       = str(data['program'])
        adjudicationId  = str(data['adjudication'])

        empty_follow_ups = '?empty_follow_ups=0'
        offset       = '&offset='               + paginationStart
        department   = '&department='           + departmentId   if departmentId     != '' else ''

        check_stage = '&check_stage='       + statusId       if statusId         != '' else ''
        if "," in statusId:
            check_stage = ''
            idsS = statusId.split(',')
            for i in idsS :
                thisCheckStage = '&check_stage=' + i
                check_stage += thisCheckStage


        city         = '&city='                 + cityId         if cityId           != '' else ''
        startDate    = '&contract_start_date='  + startDate      if startDate        != '' else ''
        endDate      = '&contract_end_date='    + endDate        if endDate          != '' else ''
        provider     = '&provider='             + providerId     if providerId       != '' else ''
        funding      = '&funding='              + fundingId      if fundingId        != '' else ''
        program      = '&program='              + programId      if programId        != '' else ''
        adjudication = '&adjudication='         + adjudicationId if adjudicationId   != '' else ''

        url = URLFrp + 'projects/with_follow_up' + empty_follow_ups + offset + department + check_stage + city + startDate + endDate + provider + funding + program + adjudication
        urlCount = URLFrp + 'projects/with_follow_up/count' + empty_follow_ups + offset + department + check_stage + city + startDate + endDate + provider + funding + program + adjudication
        r = requests.get( url)
        rC = requests.get( urlCount)
        dataRes = r.json()

        return jsonify( { 'data' : dataRes, 'count' : rC.json() } )


@bp.route('/project_detail/<int:project_id>', methods=['GET', 'POST'])
def projectDetail(project_id):

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':

        checkStates = requests.get( URLFrp + 'catalogues/check_stages' ).json()

        return render_template( 'graphics/detail.html',
                                catalog='/project_detail/',
                                menu = menuGraphics,
                                projectId= project_id,
                                pagePrevPrev = '/graphics',
                                pagePrev = '/projects_follow_ups/',
                                pathUrl = URLFrp + 'attachments/',
                                checkStates = checkStates  )

    else:

        queryStr = 'projects/with_follow_up?project=' + str(project_id)
        url = URLFrp + queryStr
        r = requests.get( url)
        dataRes = r.json()

        contractId = dataRes[0]['contract_id']

        contracts = requests.get( URLFrp + 'contracts/' + str(contractId) ).json()
        provider = requests.get( URLFrp + 'providers/' + str(contracts['provider']) ).json()

        return jsonify( { 'data' : dataRes, 'contract': contracts, 'provider': provider } )




@bp.route('/demo_grafica', methods=['GET'])
def demoGrafica():
    return render_template( 'grafica.html' )


@bp.route('/demo_seguimiento', methods=['GET'])
def demoSeguimiento():
    return render_template( 'seguimiento.html' )

@bp.route('/ventas', methods=['GET'])
def ventas():
    return render_template( 'ventas.html' )


ANIO_MIN = 2015
MES_CAMBIO_ADMON = 10
ANIOS_ADMON = 6

def calcular_periodos_admon():
    now = datetime.now()
    l = []

    ini, fin = get_periodo_admon(now)
    l.append((get_periodo_admon_str(ini, fin, ini.year, fin.year), 'Administración actual'))

    ini_year = ini.year
    while ini_year > ANIO_MIN:
        ini_year -= ANIOS_ADMON
        ini = datetime(ini_year, MES_CAMBIO_ADMON, 5)
        fin = datetime(ini_year + ANIOS_ADMON, MES_CAMBIO_ADMON, 4)
        l.append((get_periodo_admon_str(ini, fin, ini.year, fin.year), 'Administración anterior (5/oct/{} a 4/oct/{})'.format(ini.year, fin.year)))

    ini = datetime(ini_year, 1, 1)
    fin = datetime(ini_year, MES_CAMBIO_ADMON, 4)
    l.append((get_periodo_admon_str(ini, fin, ini_year, ini_year + ANIOS_ADMON), 'Administración anterior (Hasta 4/oct/{})'.format(ini_year)))

    # Agregar años
    anio = ANIO_MIN
    ini = anio
    fin = anio + ANIOS_ADMON
    while anio <= now.year:
        l.append(('{}-01-01/{}-12-31/{}/{}'.format(anio, anio, ini, fin), str(anio)))
        anio += 1
        if anio > fin:
            ini = anio - 1
            fin = anio + 5

    return l


def es_anio_cambio_admon(anio):
    return True if (anio - ANIO_MIN) % ANIOS_ADMON == 0 else False


def get_periodo_admon(fecha):
    i = fecha.year
    while not es_anio_cambio_admon(i):
        i -= 1

    if i == fecha.year:
        if fecha > datetime(i, MES_CAMBIO_ADMON, 4):
            ini = datetime(i, MES_CAMBIO_ADMON, 5)
            fin = datetime(i + ANIOS_ADMON, MES_CAMBIO_ADMON, 4)
        else:
            ini = datetime(i - ANIOS_ADMON, MES_CAMBIO_ADMON, 5)
            fin = datetime(i, MES_CAMBIO_ADMON, 4)
    else:
        ini = datetime(i, MES_CAMBIO_ADMON, 5)
        fin = datetime(i + ANIOS_ADMON, MES_CAMBIO_ADMON, 4)

    return (ini, fin)


def get_periodo_admon_str(ini, fin, anio_ini, anio_fin):
    return '{}/{}/{}/{}'.format(ini.strftime('%Y-%m-%d'), fin.strftime('%Y-%m-%d'), anio_ini, anio_fin)
