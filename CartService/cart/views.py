from django.http import HttpResponse
import datetime
from pytz import unicode


def current_datetime(request):
    date = datetime.datetime.now()
    date_json = "{ \"date\": \"" + unicode(date) + "\" }"
    return HttpResponse(date_json, content_type='application/json')
