from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@csrf_exempt
def index(request):
    return render(request, 'mi_app/index.html')

@csrf_exempt
def porcinos(request):
    return render(request, 'mi_app/porcinos.html')

@csrf_exempt
def alimentacion(request):
    return render(request, 'mi_app/alimentacion.html')

@csrf_exempt
def base(request):
    return render(request, 'mi_app/base.html')

