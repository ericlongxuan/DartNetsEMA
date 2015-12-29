<div class="top-content">
  <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href=".">EMA Manager (mVersion: {{mVersion}})</a>
      </div>
      <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav navbar-right">
          <li><a id="load-ema-link" href="#"><i class="glyphicon glyphicon-download-alt"></i>Load EMA</a></li>
          <li><a id="save-ema-link" href="#"><span class="glyphicon glyphicon glyphicon-share"></span>Save EMA</a></li>
        </ul>
      </div>
    </div>
  </nav>
</div>
<div class="modal fade alert-modal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="alert alert-danger" role="alert">
        <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
        <span class="alert-message"></span>
      </div>
    </div>
  </div>
</div>
<div class="modal fade load-modal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <span class="btn btn-primary btn-file">
        Browse <input id="file-path-input" type="file">
      </span>
      <form name="demoForm" id="demoForm" method="post" enctype="multipart/form-data"
        action="javascript: common.uploadAndSubmit();">
        <p>Upload File: <input type="file" name="file" /></p>
        <p><input type="submit" value="Submit" /></p>
      </form>
      <span><strong>Select a file to load. </strong></span>
      <div>
        <span class="label label-warning">Warning</span>
        This system only works with a json file in the "ema" folder.
      </div>
    </div>
  </div>
</div>