---
layout: post
title: Upload files using AJAX in ASP.Net MVC
description: "Simple tutorial for Upload files using AJAX in ASP.Net MVC with HTML5"
category: articles
tags: [MVC, Ajax]
comments: true
share: true
---

In one of my recent projects, I had a requirement to uploads files with AJAX. There are several jQuery plugins available, but I really don't wanna use any of them. After little research, I found a solution. It is very simple and can do it even without jQuery.
The HTML Markup

### First, setup a simple form with a fileinput and submit button.


{% highlight html %}
{% raw %}
<form id="uploader">
    <input id="fileInput" type="file" multiple>
    <input type="submit" value="Upload file" />
</form>
{% endraw %}
{% endhighlight %}

### Method 1 - Using JavaScript's FormData object

The best method recommended if you don't target legacy browsers and IE9. We will be sending data to server using JavaScript's new FormData object. This object is new in XMLHttpRequest Level 2 and not supported in all browsers. FormData object represent form fields and values as key/value pairs. Just append files to FormData object and send with XMLHttpRequest. Here goes our script.

#### The JavaScript

{% highlight javascript %}
window.onload = function () {
    document.getElementById('uploader').onsubmit = function () {
        var formdata = new FormData(); //FormData object
        var fileInput = document.getElementById('fileInput');
        //Iterating through each files selected in fileInput
        for (i = 0; i < fileInput.files.length; i++) {
            //Appending each file to FormData object
            formdata.append(fileInput.files[i].name, fileInput.files[i]);
        }
        //Creating an XMLHttpRequest and sending
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/Home/Upload');
        xhr.send(formdata);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                alert(xhr.responseText);
            }
        }
        return false;
    }
}
{% endhighlight %}


#### Controller

Posted FormData is available in controller under Request.Form property as key/value pair. Request.Files property contains a collection of HttpFileCollection. Iterate through it to get each files uploaded.

{% highlight c# %}
[HttpPost]
public JsonResult Upload()
{
    for (int i = 0; i < Request.Files.Count; i++)
    {
        HttpPostedFileBase file = Request.Files[i]; //Uploaded file
        //Use the following properties to get file's name, size and MIMEType
        int fileSize = file.ContentLength;
        string fileName = file.FileName;
        string mimeType = file.ContentType;
        System.IO.Stream fileContent = file.InputStream;
        //To save file, use SaveAs method
        file.SaveAs(Server.MapPath("~/")+ fileName ); //File will be saved in application root
    }
    return Json("Uploaded " + Request.Files.Count + " files");
}
{% endhighlight %}

### Method 2 - For legacy browsers

This approach will work on almost all browsers but, you can't upload multiple files, and file information have to send separately. In this method file is send directly in XMLHttpRequest, and file information is send along with HTTP Headers.

#### The JavaScript

{% highlight javascript %}
window.onload = function () {
    document.getElementById('uploader').onsubmit = function () {
        var fileInput = document.getElementById('fileInput');
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/Home/Upload');
        xhr.setRequestHeader('Content-type', 'multipart/form-data');
        //Appending file information in Http headers
        xhr.setRequestHeader('X-File-Name', fileInput.files[0].name);
        xhr.setRequestHeader('X-File-Type', fileInput.files[0].type);
        xhr.setRequestHeader('X-File-Size', fileInput.files[0].size);
        //Sending file in XMLHttpRequest
        xhr.send(fileInput.files[0]);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                alert(xhr.responseText);
            }
        }
        return false;
    }
}
{% endhighlight %}


#### Controller

[HttpPost]
public JsonResult Upload()
{
    string fileName = Request.Headers["X-File-Name"];
    string fileType = Request.Headers["X-File-Type"];
    int fileSize = Convert.ToInt32(Request.Headers["X-File-Size"]);
    //File's content is available in Request.InputStream property
    System.IO.Stream fileContent = Request.InputStream;
    //Creating a FileStream to save file's content
    System.IO.FileStream fileStream = System.IO.File.Create(Server.MapPath("~/") + fileName);
    fileContent.Seek(0, System.IO.SeekOrigin.Begin);
    //Copying file's content to FileStream
    fileContent.CopyTo(fileStream);
    fileStream.Dispose();
    return Json("File uploaded");
}

Thats it. We're done
